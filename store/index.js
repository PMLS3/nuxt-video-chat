import themeConfig from "@/config/themeConfig.js";
import colors from "@/config/themeConfig.js";

const userDefaults = {
  uid: 0, // From Auth
  displayName: "John Doe", // From Auth
  about:
    "Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.",
  status: "online",
  userRole: "admin"
};
// Check if device is touch device
// This is used to remove perfect scrollbar from touch devices
// Using Dynamic components
const is_touch_device = () => {
  if (process.client) {
    const prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
    const mq = function(query) {
      return window.matchMedia(query).matches;
    };

    if ("ontouchstart" in window || window.DocumentTouch) {
      return true;
    }

    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    const query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join(
      ""
    );
    return mq(query);
  } else {
    return;
  }
};
// /////////////////////////////////////////////
// State
// /////////////////////////////////////////////

export const state = () => ({
  AppActiveUser: userDefaults,

  // connected to internet
  hasNetwork: true,

  // App general Theme
  isVerticalNavMenuActive: false,
  verticalNavMenuWidth: "default",
  verticalNavMenuItemsMin: false,
  scrollY: 0,
  bodyOverlay: false,
  is_touch_device: is_touch_device(),
  // mainLayoutType: themeConfig.mainLayoutType || "vertical",
  // navbarSearchAndPinList,
  // reduceButton: themeConfig.sidebarCollapsed,
  // starredPages: navbarSearchAndPinList['pages'].data.filter(
  //   (page) => page.is_bookmarked
  // ),
  theme: themeConfig.theme || "light",
  themePrimaryColor: colors.primary,
  marginTop: 95,
  // Can be used to get current window with
  // Note: Above breakpoint state is for internal use of sidebar & navbar component
  windowWidth: null
});

export const mutations = {
  TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE(state, value) {
    state.isVerticalNavMenuActive = value;
  },
  TOGGLE_REDUCE_BUTTON(state, val) {
    state.reduceButton = val;
  },
  UPDATE_MAIN_LAYOUT_TYPE(state, val) {
    state.mainLayoutType = val;
  },
  UPDATE_VERTICAL_NAV_MENU_ITEMS_MIN(state, val) {
    state.verticalNavMenuItemsMin = val;
  },
  UPDATE_VERTICAL_NAV_MENU_WIDTH(state, width) {
    state.verticalNavMenuWidth = width;
  },
  UPDATE_WINDOW_WIDTH(state, payload) {
    console.log("paylo");
  },
  // ////////////////////////////////////////////
  // UI
  // ////////////////////////////////////////////

  TOGGLE_CONTENT_OVERLAY(state, val) {
    state.bodyOverlay = val;
  },
  UPDATE_PRIMARY_COLOR(state, val) {
    state.themePrimaryColor = val;
  },
  UPDATE_THEME(state, val) {
    state.theme = val;
  },
  UPDATE_WINDOW_WIDTH(state, width) {
    state.windowWidth = width;
  },
  UPDATE_WINDOW_SCROLL_Y(state, val) {
    state.scrollY = val;
  }
};

export const actions = {
  // Vertical NavMenu
  updateVerticalNavMenuWidth({ commit }, width) {
    commit("UPDATE_VERTICAL_NAV_MENU_WIDTH", width);
  },

  onAuthStateChanged({ commit }, { authUser }) {
    if (!authUser) {
      commit("RESET_STORE");
      return;
    }
    commit("SET_AUTH_USER", { authUser });
  }
};

export const getters = {};

export const strict = false;
