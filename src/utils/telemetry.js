import posthog from 'posthog-js';

const POSTHOG_API_KEY = import.meta.env.VITE_POSTHOG_API_KEY || 'phc_placeholder_key';
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

const TELEMETRY_SESSION_KEY = 'telemetry_session_id';
const PENDING_EVENTS_KEY = 'partidas_pendientes';

export const initTelemetry = () => {
  if (typeof window !== 'undefined') {
    posthog.init(POSTHOG_API_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
    });

    let sessionId = localStorage.getItem(TELEMETRY_SESSION_KEY);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(TELEMETRY_SESSION_KEY, sessionId);
    }

    posthog.identify(sessionId);
  }
};

export const getSessionId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TELEMETRY_SESSION_KEY);
  }
  return null;
};

export const sendTelemetryEvent = (eventName, payload) => {
  if (typeof window === 'undefined') return;

  const eventPayload = {
    ...payload,
    sessionId: getSessionId(),
  };

  if (navigator.onLine) {
    posthog.capture(eventName, eventPayload);
  } else {
    const pending = JSON.parse(localStorage.getItem(PENDING_EVENTS_KEY) || '[]');
    pending.push({ eventName, payload: eventPayload });
    localStorage.setItem(PENDING_EVENTS_KEY, JSON.stringify(pending));
  }
};

export const syncOfflineTelemetry = () => {
  if (typeof window === 'undefined') return;

  if (navigator.onLine) {
    const pending = JSON.parse(localStorage.getItem(PENDING_EVENTS_KEY) || '[]');
    if (pending.length > 0) {
      pending.forEach(event => {
        posthog.capture(event.eventName, event.payload);
      });
      localStorage.removeItem(PENDING_EVENTS_KEY);
    }
  }
};
