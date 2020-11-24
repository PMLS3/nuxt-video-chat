module.exports = {
  mode: "universal",
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: "video-chat",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    // VUESAX
    "vuesax/dist/vuesax.css",
    // Material Icons
    "material-icons/iconfont/material-icons.css"
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [{ src: "~/plugins/peer", mode: "client" }],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    "@nuxtjs/composition-api"
  ],
  tailwindcss: {
    configPath: "~/config/tailwind.config.js",
    cssPath: "~/assets/css/main.css",
    purgeCSSInDev: false
  },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
    "nuxt-socket-io"
  ],

  /*
   ** IO Config
   */
  io: {
    sockets: [
      {
        name: "home",
        url: "http://localhost:3000",

        default: process.env.DEPLOY !== "GH_PAGES",
        vuex: {
          mutations: []
        },
        namespaces: {
          "/index": {
            emitters: [
              "joinRoom + joinDetails --> roomInfo",
              "leaveRoom + joinDetails --> roomInfo",
              "sendMsg + userMsg"
            ],
            listeners: ["joinedRoom [updateUsers", "leavedRoom [updateUsers"]
          },

          "/videochat": {
            emitters: [
              "joinRoom + joinDetails --> roomInfo",
              "leaveRoom + joinDetails --> roomInfo",
              "messageSent + messageInfo",
              "sendStream + myStream",
              "videoSend + sendStream"
            ],
            listeners: [
              "joinedRoom [updateUsers",
              "leavedRoom [updateUsers",
              "receivedStream [connectToNewUser",
              "videoReceived [recv"
            ]
          }
        }
      }
    ]
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {}
};
