import ENV from "../pages/api/config/env";

// export const BACKEND_BASE_URL = `http://localhost:3000/api`;
export const BACKEND_BASE_URL = `${ENV.clientUrl}/api`;

// interface overwrie
export const JitsiMainConfigOverwrite = {
  APP_NAME: "Showwcial Meet",
  MOBILE_APP_PROMO: false,
  SHOW_JITSI_WATERMARK: false,
  HIDE_DEEP_LINKING_LOGO: true,
  NATIVE_APP_NAME: "Showwcial",
  // DEFAULT_BACKGROUND: '#5D5CD6',
  JITSI_WATERMARK_LINK: "https://showwcial.vercel.app",
  SHOW_CHROME_EXTENSION_BANNER: false,
  VIDEO_QUALITY_LABEL_DISABLED: true,
  SETTINGS_SECTIONS: ["devices", "moderator", "profile", "sounds"],
};

// config overwrite
export const JitsiVideoConfigOverwrite = {
  disableInviteFunctions: true,
  dynamicBrandingUrl: "https://showwcial.vercel.app",
  hideConferenceSubject: true,
  disableThirdPartyRequests: true,
  defaultRemoteDisplayName: "Showwcial User",
  disabledSounds: ["REACTION_SOUND"],
  autoKnockLobby: true,
  toolbarButtons: [
    // breaker
    "camera",
    "chat",
    "closedcaptions",
    "desktop",
    "download",
    "etherpad",
    "fullscreen",
    "hangup",
    "livestreaming",
    "microphone",
    "mute-everyone",
    "mute-video-everyone",
    "participants-pane",
    "profile",
    "raisehand",
    "recording",
    "security",
    "select-background",
    "settings",
    "shareaudio",
    "sharedvideo",
    "shortcuts",
    "toggle-camera",
    "__end",
  ],
};
