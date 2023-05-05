function logEvent(category, action, label, value) {
  if (window._paq) {
    window._paq.push(["trackEvent", category, action, label, value]);
  }
}

export const analytics = {
  logEvent,
};

export const AnalyticsCategories = {
  appearances: "Appearances",
};
