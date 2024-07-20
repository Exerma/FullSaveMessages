interface Window {
    browser: typeof browser;
    messenger: typeof browser;
}

import messenger = browser;

interface EventHandler<T> {
  readonly addListener: (callback: T) => void;
  readonly hasListener: (callback: T) => boolean;
  readonly removeListener: (callback: T) => void;
}

declare namespace browser.manifest {
  /**
 * Represents a native manifest file
  */
  type NativeManifest = {
      name: string
    description: string
    path: string
    type: 'pkcs11'
 | 'stdio'
    allowed_extensions: manifest.ExtensionID[]

  } | {
      name:  manifest.ExtensionID
    description: string
    data: /* "unknown" undefined */ object
    type: 'storage'

  };
  /**
 * Common properties for all manifest.json files
  */
  export interface ManifestBase {
    manifest_version: number
  /**
   * The applications property is deprecated, please use 'browser_specific_settings'
  */
    applications?: DeprecatedApplications
    browser_specific_settings?: BrowserSpecificSettings
    name: string
    short_name?: string
    description?: string
    author?: string
    version: string
    homepage_url?: string
    install_origins?: string[]
    developer?: {
      name?: string
    url?: string

  }

  }

  /**
 * Represents a WebExtension manifest.json file
  */
  export interface WebExtensionManifest {
    minimum_chrome_version?: string
    minimum_opera_version?: string
    icons?: /* "unknown" undefined */ object
  /**
   * The 'split' value is not supported.
  */
    incognito?: 'not_allowed'
 | 'spanning'
 | 'split'
    background?: {
      page: ExtensionURL
    persistent?: boolean

  } | {
      scripts: ExtensionURL[]
    type?: 'module'
 | 'classic'
    persistent?: boolean

  } | {
      service_worker: ExtensionURL

  }
  /**
   * Alias property for options_ui.page, ignored when options_ui.page is set. When using this property the options page is always opened in a new tab.
  */
    options_page?: ExtensionURL
    options_ui?: {
      page: ExtensionURL
  /**
   * Defaults to true in Manifest V2; Deprecated in Manifest V3.
  */
    browser_style?: boolean
  /**
   * chrome_style is ignored in Firefox. Its replacement (browser_style) has been deprecated.
  */
    chrome_style?: boolean
    open_in_tab?: boolean

  }
    content_scripts?: ContentScript[]
    content_security_policy?: string | {
    /**
   * The Content Security Policy used for extension pages.
  */
    extension_pages?: string

  }
    permissions?: PermissionOrOrigin[] | Permission[]
    granted_host_permissions?: boolean
    host_permissions?: MatchPattern[]
    optional_host_permissions?: MatchPattern[]
    optional_permissions?: OptionalPermissionOrOrigin[]
    web_accessible_resources?: string[] | {
      resources: string[]
    matches?: MatchPattern[]
    extension_ids?: []

  }[]
    hidden?: boolean

  }

  /**
 * Represents a WebExtension language pack manifest.json file
  */
  export interface WebExtensionLangpackManifest {
    langpack_id: string
    languages: /* "unknown" undefined */ object
    sources?: /* "unknown" undefined */ object

  }

  /**
 * Represents a WebExtension dictionary manifest.json file
  */
  export interface WebExtensionDictionaryManifest {
    dictionaries: /* "unknown" undefined */ object

  }

  export interface ThemeIcons {
  /**
   * A light icon to use for dark themes
  */
    light: ExtensionURL
  /**
   * The dark icon to use for light themes
  */
    dark: ExtensionURL
  /**
   * The size of the icons
  */
    size: number

  }

  type OptionalPermissionNoPrompt = 'idle';
  type OptionalPermission = OptionalPermissionNoPrompt | 'clipboardRead'
 | 'clipboardWrite'
 | 'geolocation'
 | 'notifications';
  type OptionalPermissionOrOrigin = OptionalPermission | MatchPattern;
  type PermissionPrivileged = 'mozillaAddons';
  type PermissionNoPrompt = OptionalPermissionNoPrompt | PermissionPrivileged | 'alarms'
 | 'storage'
 | 'unlimitedStorage';
  type Permission = PermissionNoPrompt | OptionalPermission;
  type PermissionOrOrigin = Permission | MatchPattern;
  type HttpURL = string;
  type ExtensionURL = string;
  type ExtensionFileUrl = string;
  type ImageDataOrExtensionURL = string;
  type ExtensionID = string | string;
  export interface FirefoxSpecificProperties {
    id?: ExtensionID
    update_url?: string
    strict_min_version?: string
    strict_max_version?: string
    admin_install_only?: boolean

  }

  export interface GeckoAndroidSpecificProperties {
    strict_min_version?: string
    strict_max_version?: string

  }

  export interface DeprecatedApplications {
    gecko?: FirefoxSpecificProperties

  }

  export interface BrowserSpecificSettings {
    gecko?: FirefoxSpecificProperties
    gecko_android?: GeckoAndroidSpecificProperties

  }

  type MatchPattern = '<all_urls>' | MatchPatternRestricted | MatchPatternUnestricted;
  /**
 * Same as MatchPattern above, but excludes <all_urls>
  */
  type MatchPatternRestricted = string | string;
  /**
 * Mostly unrestricted match patterns for privileged add-ons. This should technically be rejected for unprivileged add-ons, but, reasons. The MatchPattern class will still refuse privileged schemes for those extensions.
  */
  type MatchPatternUnestricted = string;
  /**
 * Details of the script or CSS to inject. Either the code or the file property must be set, but both may not be set at the same time. Based on InjectDetails, but using underscore rather than camel case naming conventions.
  */
  export interface ContentScript {
    matches: MatchPattern[]
    exclude_matches?: MatchPattern[]
    include_globs?: string[]
    exclude_globs?: string[]
  /**
   * The list of CSS files to inject
  */
    css?: ExtensionURL[]
  /**
   * The list of JS files to inject
  */
    js?: ExtensionURL[]
  /**
   * If allFrames is `true`, implies that the JavaScript or CSS should be injected into all frames of current page. By default, it's `false` and is only injected into the top frame.
  */
    all_frames?: boolean
  /**
   * If match_about_blank is true, then the code is also injected in about:blank and about:srcdoc frames if your extension has access to its parent document. Ignored if match_origin_as_fallback is specified. By default it is `false`.
  */
    match_about_blank?: boolean
  /**
   * If match_origin_as_fallback is true, then the code is also injected in about:, data:, blob: when their origin matches the pattern in 'matches', even if the actual document origin is opaque (due to the use of CSP sandbox or iframe sandbox). Match patterns in 'matches' must specify a wildcard path glob. By default it is `false`.
  */
    match_origin_as_fallback?: boolean
  /**
   * The soonest that the JavaScript or CSS will be injected into the tab. Defaults to "document_idle".
  */
    run_at?:  extensionTypes.RunAt
  /**
   * The JavaScript world for a script to execute within. Defaults to "ISOLATED".
  */
    world?:  extensionTypes.ExecutionWorld

  }

  type IconPath = /* "unknown" undefined */ object | ExtensionFileUrl;
  type IconImageData = /* "unknown" undefined */ object | ImageData;
  export interface ImageData {
  }

  type UnrecognizedProperty = any;
  /**
 * Represents a protocol handler definition.
  */
  export interface ProtocolHandler {
  /**
   * A user-readable title string for the protocol handler. This will be displayed to the user in interface objects as needed.
  */
    name: string
  /**
   * The protocol the site wishes to handle, specified as a string. For example, you can register to handle SMS text message links by registering to handle the "sms" scheme.
  */
    protocol: 'bitcoin'
 | 'dat'
 | 'dweb'
 | 'ftp'
 | 'geo'
 | 'gopher'
 | 'im'
 | 'ipfs'
 | 'ipns'
 | 'irc'
 | 'ircs'
 | 'magnet'
 | 'mailto'
 | 'matrix'
 | 'mms'
 | 'news'
 | 'nntp'
 | 'sip'
 | 'sms'
 | 'smsto'
 | 'ssb'
 | 'ssh'
 | 'tel'
 | 'urn'
 | 'webcal'
 | 'wtai'
 | 'xmpp' | string
  /**
   * The URL of the handler, as a string. This string should include "%s" as a placeholder which will be replaced with the escaped URL of the document to be handled. This URL might be a true URL, or it could be a phone number, email address, or so forth.
  */
    uriTemplate: ExtensionURL | HttpURL

  }

  export interface ActionManifest {
    default_title?: string
    default_icon?: IconPath
  /**
   * Specifies icons to use for dark and light themes
  */
    theme_icons?: ThemeIcons[]
    default_popup?: string
  /**
   * Deprecated in Manifest V3.
  */
    browser_style?: boolean
  /**
   * Defines the location the browserAction will appear by default.  The default location is navbar.
  */
    default_area?: 'navbar'
 | 'menupanel'
 | 'tabstrip'
 | 'personaltoolbar'

  }

  type ThemeColor = string | number[] | number[];
  export interface ThemeExperiment {
    stylesheet?: ExtensionURL
    images?: /* "unknown" undefined */ object
    colors?: /* "unknown" undefined */ object
    properties?: /* "unknown" undefined */ object

  }

  export interface ThemeType {
    images?: {
      additional_backgrounds?: ImageDataOrExtensionURL[]
    headerURL?: ImageDataOrExtensionURL
    theme_frame?: ImageDataOrExtensionURL

  }
    colors?: {
      tab_selected?: ThemeColor
    accentcolor?: ThemeColor
    frame?: ThemeColor
    frame_inactive?: ThemeColor
    textcolor?: ThemeColor
    tab_background_text?: ThemeColor
    tab_background_separator?: ThemeColor
    tab_loading?: ThemeColor
    tab_text?: ThemeColor
    tab_line?: ThemeColor
    toolbar?: ThemeColor
  /**
   * This color property is an alias of 'bookmark_text'.
  */
    toolbar_text?: ThemeColor
    bookmark_text?: ThemeColor
    toolbar_field?: ThemeColor
    toolbar_field_text?: ThemeColor
    toolbar_field_border?: ThemeColor
    toolbar_field_separator?: ThemeColor
    toolbar_top_separator?: ThemeColor
    toolbar_bottom_separator?: ThemeColor
    toolbar_vertical_separator?: ThemeColor
    icons?: ThemeColor
    icons_attention?: ThemeColor
    button_background_hover?: ThemeColor
    button_background_active?: ThemeColor
    popup?: ThemeColor
    popup_text?: ThemeColor
    popup_border?: ThemeColor
    toolbar_field_focus?: ThemeColor
    toolbar_field_text_focus?: ThemeColor
    toolbar_field_border_focus?: ThemeColor
    popup_highlight?: ThemeColor
    popup_highlight_text?: ThemeColor
    ntp_background?: ThemeColor
    ntp_card_background?: ThemeColor
    ntp_text?: ThemeColor
    sidebar?: ThemeColor
    sidebar_border?: ThemeColor
    sidebar_text?: ThemeColor
    sidebar_highlight?: ThemeColor
    sidebar_highlight_text?: ThemeColor
    toolbar_field_highlight?: ThemeColor
    toolbar_field_highlight_text?: ThemeColor

  }
    properties?: {
      additional_backgrounds_alignment?: 'bottom'
 | 'center'
 | 'left'
 | 'right'
 | 'top'
 | 'center bottom'
 | 'center center'
 | 'center top'
 | 'left bottom'
 | 'left center'
 | 'left top'
 | 'right bottom'
 | 'right center'
 | 'right top'[]
    additional_backgrounds_tiling?: 'no-repeat'
 | 'repeat'
 | 'repeat-x'
 | 'repeat-y'[]
    color_scheme?: 'auto'
 | 'light'
 | 'dark'
 | 'system'
    content_color_scheme?: 'auto'
 | 'light'
 | 'dark'
 | 'system'

  }

  }

  /**
 * Contents of manifest.json for a static theme
  */
  export interface ThemeManifest {
    theme: ThemeType
    dark_theme?: ThemeType
    default_locale?: string
    theme_experiment?: ThemeExperiment
    icons?: /* "unknown" undefined */ object

  }

  /**
 * Definition of a shortcut, for example <var>Alt+F5</var>. The string must match the shortcut format as defined by the <a href='url-commands-shortcuts'>MDN page of the commands API</a>.
  */
  /**
 * Definition of a shortcut, for example <var>Alt+F5</var>. The string must match the shortcut format as defined by the <a href='url-commands-shortcuts'>MDN page of the commands API</a>.
  */
  type KeyName = string;
}

  /**
 * Use a messageDisplayAction to put a button in the message display toolbar. In addition to its icon, a messageDisplayAction button can also have a tooltip, a badge, and a popup.
  */
declare namespace browser.messageDisplayAction {
  /**
 * An array of four integers in the range [0,255] that make up the RGBA color. For example, opaque red is <var>[255, 0, 0, 255]</var>.
  */
  type ColorArray = number[];
  /**
 * Pixel data for an image. Must be an <a href='url-image-data'>ImageData</a> object (for example, from a <a href='url-canvas-element'>canvas</a> element).
  */
  export interface ImageDataType {
  }

  /**
 * A *dictionary object* to specify multiple <a href='url-image-data'>ImageData</a> objects in different sizes, so the icon does not have to be scaled for a device with a different pixel density. Each entry is a *name-value* pair with *value* being an <a href='url-image-data'>ImageData</a> object, and *name* its size. Example: <literalinclude>includes/ImageDataDictionary.json<lang>JavaScript</lang></literalinclude>See the <a href='url-mdn-icon-size'>MDN documentation about choosing icon sizes</a> for more information on this.
  */
  export interface ImageDataDictionary {
  }

  /**
 * Information sent when a messageDisplayAction button is clicked.
  */
  export interface OnClickData {
  /**
   * An array of keyboard modifiers that were held while the menu item was clicked.
  */
    modifiers: 'Shift'
 | 'Alt'
 | 'Command'
 | 'Ctrl'
 | 'MacCtrl'[]
  /**
   * An integer value of button by which menu item was clicked.
  */
    button?: number

  }

  /**
 * Sets the title of the messageDisplayAction button. Is used as tooltip and as the label.
  */
  function setTitle(details: {
    /**
   * A string the messageDisplayAction button should display as its label and when moused over. Cleared by setting it to <var>null</var> or an empty string (title defined the manifest will be used).
  */
    title: string | void /* could not determine correct type */
  /**
   * Sets the title only for the given tab.
  */
    tabId?: number

  }): Promise<void | null>;
  /**
 * Gets the title of the messageDisplayAction button.
  */
  function getTitle(details: {
    /**
   * Specifies for which tab the title should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<string | null>;
  /**
 * Sets the label of the messageDisplayAction button. Can be used to set different values for the tooltip (defined by the title) and the label. Additionally, the label can be set to an empty string, not showing any label at all.
  */
  function setLabel(details: {
    /**
   * A string the messageDisplayAction button should use as its label, overriding the defined title. Can be set to an empty string to not display any label at all. If the containing toolbar is configured to display text only, its title will be used. Cleared by setting it to <var>null</var>.
  */
    label: string | void /* could not determine correct type */
  /**
   * Sets the label only for the given tab.
  */
    tabId?: number

  }): Promise<void | null>;
  /**
 * Gets the label of the messageDisplayAction button. Returns <var>null</var>, if no label has been set and the title is used.
  */
  function getLabel(details: {
    /**
   * Specifies for which tab the label should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<string | void /* could not determine correct type */ | null>;
  /**
 * Sets the icon for the messageDisplayAction button. Either the <var>path</var> or the <var>imageData</var> property must be specified.
  */
  function setIcon(details: {
    /**
   * The image data for one or more icons for the composeAction button.
  */
    imageData?: ImageDataType | ImageDataDictionary
  /**
   * The paths to one or more icons for the messageDisplayAction button.
  */
    path?:  manifest.IconPath
  /**
   * Sets the icon only for the given tab.
  */
    tabId?: number

  }): Promise<void | null>;
  /**
 * Sets the html document to be opened as a popup when the user clicks on the messageDisplayAction button.
  */
  function setPopup(details: {
    /**
   * The html file to show in a popup. Can be set to an empty string to not open a popup. Cleared by setting it to <var>null</var> (action will use the popup value defined in the manifest).
  */
    popup: string | void /* could not determine correct type */
  /**
   * Sets the popup only for the given tab.
  */
    tabId?: number

  }): Promise<void | null>;
  /**
 * Gets the html document set as the popup for this messageDisplayAction button.
  */
  function getPopup(details: {
    /**
   * Specifies for which tab the popup document should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<string | null>;
  /**
 * Sets the badge text for the messageDisplayAction button. The badge is displayed on top of the icon.
  */
  function setBadgeText(details: {
    /**
   * Any number of characters can be passed, but only about four can fit in the space. Cleared by setting it to <var>null</var> or an empty string.
  */
    text: string | void /* could not determine correct type */
  /**
   * Sets the badge text only for the given tab.
  */
    tabId?: number

  }): Promise<void | null>;
  /**
 * Gets the badge text of the messageDisplayAction button.
  */
  function getBadgeText(details: {
    /**
   * Specifies for which tab the badge text should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<string | null>;
  /**
 * Sets the text color for the badge.
  */
  function setBadgeTextColor(details: {
    /**
   * The color to use as text color in the badge. Cleared by setting it to <var>null</var>.
  */
    color: string | ColorArray | void /* could not determine correct type */
  /**
   * Sets the text color for the badge only for the given tab.
  */
    tabId?: number

  }): Promise<any>;
  /**
 * Gets the text color of the badge.
  */
  function getBadgeTextColor(details: {
    /**
   * Specifies for which tab the badge text color should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<spacesToolbar.ColorArray | null>;
  /**
 * Sets the background color for the badge.
  */
  function setBadgeBackgroundColor(details: {
    /**
   * The color to use as background in the badge. Cleared by setting it to <var>null</var>.
  */
    color: string | ColorArray | void /* could not determine correct type */
  /**
   * Sets the background color for the badge only for the given tab.
  */
    tabId?: number

  }): Promise<void | null>;
  /**
 * Gets the badge background color of the messageDisplayAction button.
  */
  function getBadgeBackgroundColor(details: {
    /**
   * Specifies for which tab the badge background color should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<spacesToolbar.ColorArray | null>;
  /**
 * Enables the messageDisplayAction button for a specific tab (if a <var>tabId</var> is provided), or for all tabs which do not have a custom enable state. Once the enable state of a tab has been updated individually, all further changes to its state have to be done individually as well. By default, a messageDisplayAction button is enabled.
  */
  function enable(/**
 * The id of the tab for which you want to modify the messageDisplayAction button.
  */

tabId?: number): Promise<void | null>;
  /**
 * Disables the messageDisplayAction button for a specific tab (if a <var>tabId</var> is provided), or for all tabs which do not have a custom enable state. Once the enable state of a tab has been updated individually, all further changes to its state have to be done individually as well.
  */
  function disable(/**
 * The id of the tab for which you want to modify the messageDisplayAction button.
  */

tabId?: number): Promise<void | null>;
  /**
 * Checks whether the messageDisplayAction button is enabled.
  */
  function isEnabled(details: {
    /**
   * Specifies for which tab the state should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<boolean | null>;
  /**
 * Opens the action's popup window in the specified window. Defaults to the current window. Returns false if the popup could not be opened because the action has no popup, is of type <var>menu</var>, is disabled or has been removed from the toolbar.
  */
  function openPopup(/**
 * An object with information about the popup to open.
  */

options?: {
    /**
   * Defaults to the current window.
  */
    windowId?: number

  }): Promise<boolean | null>;
    const onClicked: EventHandler<  /**
 * Fired when a messageDisplayAction button is clicked. This event will not fire if the messageDisplayAction has a popup. This is a user input event handler. For asynchronous listeners some <a href='url-user-input-restrictions'>restrictions</a> apply.
  */
  ((tab:  tabs.Tab, info?: OnClickData) => void)>;
}

declare namespace browser.messageDisplay {
  /**
 * Gets the currently displayed message in the specified tab (even if the tab itself is currently not visible), or the currently active tab. It returns <var>null</var> if no messages are displayed, or if multiple messages are displayed.
  */
  function getDisplayedMessage(tabId?: number): Promise< messages.MessageHeader | void /* could not determine correct type */ | null>;
  /**
 * Gets an array of the currently displayed messages in the specified tab (even if the tab itself is currently not visible), or the currently active tab. The array is empty if no messages are displayed.
  */
  function getDisplayedMessages(tabId?: number): Promise<messages.MessageHeader[] |  messages.MessageList | null>;
  /**
 * Opens a message in a new tab or in a new window.
  */
  function open(/**
 * Settings for opening the message. Exactly one of messageId, headerMessageId or file must be specified.
  */

openProperties: {
    /**
   * The DOM file object of a message to be opened.
  */
    file?: /* "unknown" undefined */ object
  /**
   * The id of a message to be opened. Will throw an *ExtensionError*, if the provided <var>messageId</var> is unknown or invalid.
  */
    messageId?:  messages.MessageId
  /**
   * The headerMessageId of a message to be opened. Will throw an *ExtensionError*, if the provided <var>headerMessageId</var> is unknown or invalid. Not supported for external messages.
  */
    headerMessageId?: string
  /**
   * Where to open the message. If not specified, the users preference is honoured.
  */
    location?: 'tab'
 | 'window'
  /**
   * Whether the new tab should become the active tab in the window. Only applicable to messages opened in tabs.
  */
    active?: boolean
  /**
   * The id of the window, where the new tab should be created. Defaults to the current window. Only applicable to messages opened in tabs.
  */
    windowId?: number

  }): Promise< tabs.Tab | null>;
    const onMessageDisplayed: EventHandler<  /**
 * Fired when a message is displayed, whether in a 3-pane tab, a message tab, or a message window.
  */
  ((tab:  tabs.Tab, message:  messages.MessageHeader) => void)>;
    const onMessagesDisplayed: EventHandler<  /**
 * Fired when either a single message is displayed or when multiple messages are displayed, whether in a 3-pane tab, a message tab, or a message window.
  */
  ((tab:  tabs.Tab, messages: messages.MessageHeader[], displayedMessages:  messages.MessageList) => void)>;
}

declare namespace browser.spaces {
  export interface SpaceButtonProperties_MV2 {
  /**
   * Sets the background color of the badge. Can be specified as an array of four integers in the range [0,255] that make up the RGBA color of the badge. For example, opaque red is <var>[255, 0, 0, 255]</var>. Can also be a string with an HTML color name (<var>red</var>) or a HEX color value (<var>#FF0000</var> or <var>#F00</var>). Reset when set to an empty string.
  */
    badgeBackgroundColor?: string |  spaces.ColorArray
  /**
   * Sets the badge text for the button in the spaces toolbar. The badge is displayed on top of the icon. Any number of characters can be set, but only about four can fit in the space. Removed when set to an empty string.
  */
    badgeText?: string
  /**
   * The paths to one or more icons for the button in the spaces toolbar. Reset to the extension icon, when set to an empty string.
  */
    defaultIcons?: string |  manifest.IconPath
  /**
   * Specifies dark and light icons for the button in the spaces toolbar to be used with themes: The <var>light</var> icons will be used on dark backgrounds and vice versa. At least the set for *16px* icons should be specified. The set for *32px* icons will be used on screens with a very high pixel density, if specified. Reset when set to an empty array.
  */
    themeIcons?: manifest.ThemeIcons[]
  /**
   * The title for the button in the spaces toolbar, used in the tooltip of the button and as the displayed name in the overflow menu. Reset to the name of the extension, when set to an empty string.
  */
    title?: string

  }

  export interface SpaceButtonProperties_MV3 {
  /**
   * Sets the background color of the badge. Can be specified as an array of four integers in the range [0,255] that make up the RGBA color of the badge. For example, opaque red is <var>[255, 0, 0, 255]</var>. Can also be a string with an HTML color name (<var>red</var>) or a HEX color value (<var>#FF0000</var> or <var>#F00</var>). Reset when set to <var>null</var>.
  */
    badgeBackgroundColor?: string |  spaces.ColorArray
  /**
   * Sets the badge text for the button in the spaces toolbar. The badge is displayed on top of the icon. Any number of characters can be set, but only about four can fit in the space. Removed when set to <var>null</var>.
  */
    badgeText?: string
  /**
   * The paths to one or more icons for the button in the spaces toolbar. Reset to the extension icon, when set to <var>null</var>.
  */
    defaultIcons?:  manifest.IconPath
  /**
   * Specifies dark and light icons for the button in the spaces toolbar to be used with themes: The <var>light</var> icons will be used on dark backgrounds and vice versa. At least the set for *16px* icons should be specified. The set for *32px* icons will be used on screens with a very high pixel density, if specified. Reset when set to <var>null</var>.
  */
    themeIcons?: manifest.ThemeIcons[]
  /**
   * The title for the button in the spaces toolbar, used in the tooltip of the button and as the displayed name in the overflow menu. Reset to the name of the extension, when set to <var>null</var>.
  */
    title?: string

  }

  /**
 * An array of four integers in the range [0,255] that make up the RGBA color. For example, opaque red is <var>[255, 0, 0, 255]</var>.
  */
  type ColorArray = number[];
  export interface Space {
  /**
   * The id of the space.
  */
    id: number
  /**
   * The name of the space. Names are unique for a single extension, but different extensions may use the same name.
  */
    name: string
  /**
   * Whether this space is one of the default Thunderbird spaces, or an extension space.
  */
    isBuiltIn: boolean
  /**
   * Whether this space was created by this extension.
  */
    isSelfOwned: boolean
  /**
   * The id of the extension which owns the space. The <permission>management</permission> permission is required to include this property.
  */
    extensionId?: string

  }

  /**
 * Creates a new space and adds its button to the spaces toolbar.
  */
  function create(/**
 * The name to assign to this space. May only contain alphanumeric characters and underscores. Must be unique for this extension.
  */

name: string, /**
 * The default space url, loaded into a tab when the button in the spaces toolbar is clicked. Supported are <var>https://</var> and <var>http://</var> links, as well as links to WebExtension pages.
  */

defaultUrl: string, /**
 * Properties of the button for the new space.
  */

buttonProperties?:  spaces.SpaceButtonProperties_MV3 |  spaces.SpaceButtonProperties_MV2): Promise< spaces.Space | null>;
  /**
 * Retrieves details about the specified space.
  */
  function get(/**
 * The id of the space.
  */

spaceId: number): Promise< spaces.Space | null>;
  /**
 * Gets all spaces that have the specified properties, or all spaces if no properties are specified.
  */
  function query(queryInfo?: {
    /**
   * The id of the space.
  */
    id?: number
  /**
   * The id of the space.
  */
    spaceId?: number
  /**
   * The name of the spaces (names are not unique).
  */
    name?: string
  /**
   * Spaces should be default Thunderbird spaces.
  */
    isBuiltIn?: boolean
  /**
   * Spaces should have been created by this extension.
  */
    isSelfOwned?: boolean
  /**
   * Id of the extension which should own the spaces. The <permission>management</permission> permission is required to be able to match against extension ids.
  */
    extensionId?: string

  }): Promise<spaces.Space[] | null>;
  /**
 * Removes the specified space, closes all its tabs and removes its button from the spaces toolbar. Throws an exception if the requested space does not exist or was not created by this extension.
  */
  function remove(/**
 * The id of the space.
  */

spaceId: number): Promise<any>;
  /**
 * Updates the specified space. Throws an exception if the requested space does not exist or was not created by this extension.
  */
  function update(/**
 * The id of the space.
  */

spaceId: number, /**
 * The default space url, loaded into a tab when the button in the spaces toolbar is clicked. Supported are <var>https://</var> and <var>http://</var> links, as well as links to WebExtension pages.
  */

defaultUrl?: string, /**
 * Only specified button properties will be updated.
  */

buttonProperties?:  spaces.SpaceButtonProperties_MV3 |  spaces.SpaceButtonProperties_MV2): Promise<any>;
  /**
 * Opens or switches to the specified space. Throws an exception if the requested space does not exist or was not created by this extension.
  */
  function open(/**
 * The id of the space.
  */

spaceId: number, /**
 * The id of the normal window, where the space should be opened. Defaults to the most recent normal window.
  */

windowId?: number): Promise< tabs.Tab | null>;
}

declare namespace browser.theme {
  /**
 * Info provided in the onUpdated listener.
  */
  export interface ThemeUpdateInfo {
  /**
   * The new theme after update
  */
    theme: /* "unknown" undefined */ object
  /**
   * The id of the window the theme has been applied to
  */
    windowId?: number

  }

  /**
 * Returns the current theme for the specified window or the last focused window.
  */
  function getCurrent(/**
 * The window for which we want the theme.
  */

windowId?: number): Promise<any>;
  /**
 * Make complete updates to the theme. Resolves when the update has completed.
  */
  function update(/**
 * The id of the window to update. No id updates all windows.
  */

windowId: number, /**
 * The properties of the theme to update.
  */

details:  manifest.ThemeType): Promise<any>;
  function update(/**
 * The properties of the theme to update.
  */

details:  manifest.ThemeType): Promise<any>;
  /**
 * Removes the updates made to the theme.
  */
  function reset(/**
 * The id of the window to reset. No id resets all windows.
  */

windowId?: number): Promise<any>;
  /**
 * Returns the current theme for the specified window or the last focused window.
  */
  function getCurrent(/**
 * The window for which we want the theme.
  */

windowId?: number): Promise<manifest.ThemeType | null>;
  /**
 * Make complete updates to the theme. Resolves when the update has completed.
  */
  function update(/**
 * The id of the window to update. No id updates all windows.
  */

windowId: number, /**
 * The properties of the theme to update.
  */

details:  manifest.ThemeType): Promise<any>;
  function update(/**
 * The properties of the theme to update.
  */

details:  manifest.ThemeType): Promise<any>;
  /**
 * Removes the updates made to the theme.
  */
  function reset(/**
 * The id of the window to reset. No id resets all windows.
  */

windowId?: number): Promise<any>;
    const onUpdated: EventHandler<  /**
 * Fired when a new theme has been applied
  */
  ((/**
 * Details of the theme update
  */

updateInfo: ThemeUpdateInfo) => void)>;
}

declare namespace browser.sessions {
  /**
 * Store a key/value pair associated with a given tab.
  */
  function setTabValue(/**
 * ID of the tab with which you want to associate the data. Error is thrown if ID is invalid.
  */

tabId: number, /**
 * Key that you can later use to retrieve this particular data value.
  */

key: string, value: string): Promise<any>;
  /**
 * Retrieve a previously stored value for a given tab, given its key. Returns <var>undefined</var> if the key does not exist.
  */
  function getTabValue(/**
 * ID of the tab whose data you are trying to retrieve. Error is thrown if ID is invalid.
  */

tabId: number, /**
 * Key identifying the particular value to retrieve.
  */

key: string): Promise<string | null>;
  /**
 * Remove a key/value pair from a given tab.
  */
  function removeTabValue(/**
 * ID of the tab whose data you are trying to remove. Error is thrown if ID is invalid.
  */

tabId: number, /**
 * Key identifying the particular value to remove.
  */

key: string): Promise<any>;
}

declare namespace browser.action {
  /**
 * Specifies to which tab or window the value should be set, or from which one it should be retrieved. If no tab nor window is specified, the global value is set or retrieved.
  */
  export interface Details {
  /**
   * When setting a value, it will be specific to the specified tab, and will automatically reset when the tab navigates. When getting, specifies the tab to get the value from; if there is no tab-specific value, the window one will be inherited.
  */
    tabId?: number
  /**
   * When setting a value, it will be specific to the specified window. When getting, specifies the window to get the value from; if there is no window-specific value, the global one will be inherited.
  */
    windowId?: number

  }

  type ColorArray = number[];
  /**
 * Pixel data for an image. Must be an ImageData object (for example, from a `canvas` element).
  */
  export interface ImageDataType {
  }

  /**
 * An array of four integers in the range [0,255] that make up the RGBA color of the badge. For example, opaque red is `[255, 0, 0, 255]`. Can also be a string with a CSS value, with opaque red being `#FF0000` or `#F00`.
  */
  type ColorValue = string | ColorArray | void /* could not determine correct type */;
  /**
 * Information sent when a browser action is clicked.
  */
  export interface OnClickData {
  /**
   * An array of keyboard modifiers that were held while the menu item was clicked.
  */
    modifiers: 'Shift'
 | 'Alt'
 | 'Command'
 | 'Ctrl'
 | 'MacCtrl'[]
  /**
   * An integer value of button by which menu item was clicked.
  */
    button?: number

  }

  /**
 * A *dictionary object* to specify multiple <a href='url-image-data'>ImageData</a> objects in different sizes, so the icon does not have to be scaled for a device with a different pixel density. Each entry is a *name-value* pair with *value* being an <a href='url-image-data'>ImageData</a> object, and *name* its size. Example: <literalinclude>includes/ImageDataDictionary.json<lang>JavaScript</lang></literalinclude>See the <a href='url-mdn-icon-size'>MDN documentation about choosing icon sizes</a> for more information on this.
  */
  export interface ImageDataDictionary {
  }

  /**
 * Sets the title of the browser action. This shows up in the tooltip.
  */
  function setTitle(details: {
    /**
   * The string the browser action should display when moused over.
  */
    title: string | void /* could not determine correct type */

  }): Promise<void | null>;
  /**
 * Gets the title of the browser action.
  */
  function getTitle(details: Details): Promise<string>;
  /**
 * Returns the user-specified settings relating to an extension's action.
  */
  function getUserSettings(): Promise<{
    /**
   * Whether the extension's action icon is visible on browser windows' top-level toolbar (i.e., whether the extension has been 'pinned' by the user).
  */
    isOnToolbar?: boolean

  }>;
  /**
 * Sets the icon for the browser action. The icon can be specified either as the path to an image file or as the pixel data from a canvas element, or as dictionary of either one of those. Either the **path** or the **imageData** property must be specified.
  */
  function setIcon(details: {
    /**
   * Either an ImageData object or a dictionary {size -> ImageData} representing icon to be set. If the icon is specified as a dictionary, the actual image to be used is chosen depending on screen's pixel density. If the number of image pixels that fit into one screen space unit equals `scale`, then image with size `scale` * 19 will be selected. Initially only scales 1 and 2 will be supported. At least one image must be specified. Note that 'details.imageData = foo' is equivalent to 'details.imageData = {'19': foo}'
  */
    imageData?: ImageDataType | /* "unknown" undefined */ object
  /**
   * Either a relative image path or a dictionary {size -> relative image path} pointing to icon to be set. If the icon is specified as a dictionary, the actual image to be used is chosen depending on screen's pixel density. If the number of image pixels that fit into one screen space unit equals `scale`, then image with size `scale` * 19 will be selected. Initially only scales 1 and 2 will be supported. At least one image must be specified. Note that 'details.path = foo' is equivalent to 'details.imageData = {'19': foo}'
  */
    path?: string | /* "unknown" undefined */ object

  }): Promise<void | null>;
  /**
 * Sets the html document to be opened as a popup when the user clicks on the browser action's icon.
  */
  function setPopup(details: {
    /**
   * The html file to show in a popup.  If set to the empty string (''), no popup is shown.
  */
    popup: string | void /* could not determine correct type */

  }): Promise<void | null>;
  /**
 * Gets the html document set as the popup for this browser action.
  */
  function getPopup(details: Details): Promise<string>;
  /**
 * Sets the badge text for the browser action. The badge is displayed on top of the icon.
  */
  function setBadgeText(details: {
    /**
   * Any number of characters can be passed, but only about four can fit in the space.
  */
    text: string | void /* could not determine correct type */

  }): Promise<void | null>;
  /**
 * Gets the badge text of the browser action. If no tab nor window is specified is specified, the global badge text is returned.
  */
  function getBadgeText(details: Details): Promise<string>;
  /**
 * Sets the background color for the badge.
  */
  function setBadgeBackgroundColor(details: {
      color: ColorValue

  }): Promise<void | null>;
  /**
 * Gets the background color of the browser action badge.
  */
  function getBadgeBackgroundColor(details: Details): Promise<spacesToolbar.ColorArray>;
  /**
 * Sets the text color for the badge.
  */
  function setBadgeTextColor(details: {
      color: ColorValue

  }): Promise<any>;
  /**
 * Gets the text color of the browser action badge.
  */
  function getBadgeTextColor(details: Details): Promise<any>;
  /**
 * Enables the browser action for a tab. By default, browser actions are enabled.
  */
  function enable(/**
 * The id of the tab for which you want to modify the browser action.
  */

tabId?: number): Promise<void | null>;
  /**
 * Disables the browser action for a tab.
  */
  function disable(/**
 * The id of the tab for which you want to modify the browser action.
  */

tabId?: number): Promise<void | null>;
  /**
 * Checks whether the browser action is enabled.
  */
  function isEnabled(details: Details): Promise<any>;
  /**
 * Opens the extension popup window in the specified window.
  */
  function openPopup(/**
 * An object with information about the popup to open.
  */

options?: {
    /**
   * Defaults to the $(topic:current-window)[current window].
  */
    windowId?: number

  }): Promise<any>;
  /**
 * Sets the title of the action button. Is used as tooltip and as the label.
  */
  function setTitle(details: {
    /**
   * A string the action button should display as its label and when moused over. Cleared by setting it to <var>null</var> or an empty string (title defined the manifest will be used).
  */
    title: string | void /* could not determine correct type */
  /**
   * Sets the title only for the given tab.
  */
    tabId?: number

  }): Promise<void | null>;
  /**
 * Gets the title of the action button.
  */
  function getTitle(details: {
    /**
   * Specifies for which tab the title should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<string | null>;
  /**
 * Sets the label of the action button. Can be used to set different values for the tooltip (defined by the title) and the label. Additionally, the label can be set to an empty string, not showing any label at all.
  */
  function setLabel(details: {
    /**
   * A string the action button should use as its label, overriding the defined title. Can be set to an empty string to not display any label at all. If the containing toolbar is configured to display text only, its title will be used. Cleared by setting it to <var>null</var>.
  */
    label: string | void /* could not determine correct type */
  /**
   * Sets the label only for the given tab.
  */
    tabId?: number

  }): Promise<void | null>;
  /**
 * Gets the label of the action button. Returns <var>null</var>, if no label has been set and the title is used.
  */
  function getLabel(details: {
    /**
   * Specifies for which tab the label should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<string | void /* could not determine correct type */ | null>;
  /**
 * Sets the icon for the action button. Either the <var>path</var> or the <var>imageData</var> property must be specified.
  */
  function setIcon(details: {
    /**
   * The image data for one or more icons for the action button.
  */
    imageData?: ImageDataType | ImageDataDictionary
  /**
   * The paths to one or more icons for the action button.
  */
    path?:  manifest.IconPath
  /**
   * Sets the icon only for the given tab.
  */
    tabId?: number

  }): Promise<void | null>;
  /**
 * Sets the html document to be opened as a popup when the user clicks on the action button.
  */
  function setPopup(details: {
    /**
   * The html file to show in a popup. Can be set to an empty string to not open a popup. Cleared by setting it to <var>null</var> (popup value defined the manifest will be used).
  */
    popup: string | void /* could not determine correct type */
  /**
   * Sets the popup only for the given tab.
  */
    tabId?: number

  }): Promise<void | null>;
  /**
 * Gets the html document set as the popup for this action button.
  */
  function getPopup(details: {
    /**
   * Specifies for which tab the popup document should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<string | null>;
  /**
 * Sets the badge text for the action button. The badge is displayed on top of the icon.
  */
  function setBadgeText(details: {
    /**
   * Any number of characters can be passed, but only about four can fit in the space. Cleared by setting it to <var>null</var> or an empty string.
  */
    text: string | void /* could not determine correct type */
  /**
   * Sets the badge text only for the given tab.
  */
    tabId?: number

  }): Promise<void | null>;
  /**
 * Gets the badge text of the action button.
  */
  function getBadgeText(details: {
    /**
   * Specifies for which tab the badge text should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<string | null>;
  /**
 * Sets the text color for the badge.
  */
  function setBadgeTextColor(details: {
    /**
   * The color to use as text color in the badge. Cleared by setting it to <var>null</var>.
  */
    color: string | ColorArray | void /* could not determine correct type */
  /**
   * Sets the text color for the badge only for the given tab.
  */
    tabId?: number

  }): Promise<any>;
  /**
 * Gets the text color of the badge.
  */
  function getBadgeTextColor(details: {
    /**
   * Specifies for which tab the badge text color should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<spacesToolbar.ColorArray | null>;
  /**
 * Sets the background color for the badge.
  */
  function setBadgeBackgroundColor(details: {
    /**
   * The color to use as background in the badge. Cleared by setting it to <var>null</var>.
  */
    color: string | ColorArray | void /* could not determine correct type */
  /**
   * Sets the background color for the badge only for the given tab.
  */
    tabId?: number

  }): Promise<void | null>;
  /**
 * Gets the badge background color of the action button.
  */
  function getBadgeBackgroundColor(details: {
    /**
   * Specifies for which tab the badge background color should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<spacesToolbar.ColorArray | null>;
  /**
 * Enables the action button for a specific tab (if a <var>tabId</var> is provided), or for all tabs which do not have a custom enable state. Once the enable state of a tab has been updated individually, all further changes to its state have to be done individually as well. By default, an action button is enabled.
  */
  function enable(/**
 * The id of the tab for which you want to modify the action button.
  */

tabId?: number): Promise<void | null>;
  /**
 * Disables the action button for a specific tab (if a <var>tabId</var> is provided), or for all tabs which do not have a custom enable state. Once the enable state of a tab has been updated individually, all further changes to its state have to be done individually as well.
  */
  function disable(/**
 * The id of the tab for which you want to modify the action button.
  */

tabId?: number): Promise<void | null>;
  /**
 * Checks whether the action button is enabled.
  */
  function isEnabled(details: {
    /**
   * Specifies for which tab the state should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<boolean | null>;
  /**
 * Opens the action's popup window in the specified window. Defaults to the current window. Returns false if the popup could not be opened because the action has no popup, is of type <var>menu</var>, is disabled or has been removed from the toolbar.
  */
  function openPopup(/**
 * An object with information about the popup to open.
  */

options?: {
    /**
   * Defaults to the current window.
  */
    windowId?: number

  }): Promise<boolean | null>;
    const onClicked: EventHandler<  /**
 * Fired when a browser action icon is clicked.  This event will not fire if the browser action has a popup.
  */
  ((tab:  tabs.Tab, info?: OnClickData) => void)>;
}

declare namespace browser.browserAction {
}

declare namespace browser.mailTabs {
  /**
 * A supported folder mode in the folder pane.
  */
  /**
 * A supported folder mode in the folder pane.
  */
  type FolderMode = string;
  export interface MailTab {
    id: number
    tabId: number
    windowId: number
    active: boolean
  /**
   * Grouping type of the message list.
  */
    groupType?: 'ungrouped'
 | 'groupedByThread'
 | 'groupedBySortType'
  /**
   * The primary sort column of the message list.
  */
    sortType?: 'none'
 | 'date'
 | 'subject'
 | 'author'
 | 'id'
 | 'thread'
 | 'priority'
 | 'status'
 | 'size'
 | 'flagged'
 | 'unread'
 | 'recipient'
 | 'location'
 | 'tags'
 | 'junkStatus'
 | 'attachments'
 | 'account'
 | 'custom'
 | 'received'
 | 'correspondent'
  /**
   * The sort order of the message list.
  */
    sortOrder?: 'none'
 | 'ascending'
 | 'descending'
  /**
   * Grouping type of the message list.
  */
    viewType?: 'ungrouped'
 | 'groupedByThread'
 | 'groupedBySortType'
  /**
   * The arrangement of the folder pane, message list pane, and message display pane.
  */
    layout: 'standard'
 | 'wide'
 | 'vertical'
  /**
   * The folder mode of the currently displayed folder.
  */
    folderMode?:  mailTabs.FolderMode
  /**
   * The enabled folder modes in the folder pane, and their sort order.
  */
    folderModesEnabled?: mailTabs.FolderMode[]
  /**
   * Whether the folder pane is visible or not.
  */
    folderPaneVisible?: boolean
  /**
   * Whether the message pane is visible or not.
  */
    messagePaneVisible?: boolean
  /**
   * The folder displayed in the mail tab. The <permission>accountsRead</permission> permission is required for this property to be included.
  */
    displayedFolder?:  folders.MailFolder

  }

  export interface MailTabProperties {
  /**
   * Grouping type of the message list.
  */
    groupType?: 'ungrouped'
 | 'groupedByThread'
 | 'groupedBySortType'
  /**
   * Sorts the list of messages. <var>sortOrder</var> must also be given.
  */
    sortType?: 'none'
 | 'date'
 | 'subject'
 | 'author'
 | 'id'
 | 'thread'
 | 'priority'
 | 'status'
 | 'size'
 | 'flagged'
 | 'unread'
 | 'recipient'
 | 'location'
 | 'tags'
 | 'junkStatus'
 | 'attachments'
 | 'account'
 | 'custom'
 | 'received'
 | 'correspondent'
  /**
   * Sorts the list of messages. <var>sortType</var> must also be given.
  */
    sortOrder?: 'none'
 | 'ascending'
 | 'descending'
  /**
   * Sets the grouping type of displayed messages.
  */
    viewType?: 'ungrouped'
 | 'groupedByThread'
 | 'groupedBySortType'
  /**
   * Sets the arrangement of the folder pane, message list pane, and message display pane. Note that setting this applies it to all mail tabs.
  */
    layout?: 'standard'
 | 'wide'
 | 'vertical'
  /**
   * Shows or hides the folder pane.
  */
    folderPaneVisible?: boolean
  /**
   * Sets the currently used folder mode, enabling it if required. If used without also specifying <var>displayedFolder</var>, the currently selected folder is re-selected in the new folder mode, if possible.
  */
    folderMode?:  mailTabs.FolderMode
  /**
   * Set the enabled folder modes in the folder pane, and their sort order.
  */
    folderModesEnabled?: mailTabs.FolderMode[]
  /**
   * Shows or hides the message display pane.
  */
    messagePaneVisible?: boolean
  /**
   * Sets the folder displayed in the mail tab. Requires the <permission>accountsRead</permission> permission. The previous message selection in the given folder will be restored, if any. This property is ignored, if <var>selectedMessages</var> is specified.
  */
    displayedFolderId?:  folders.MailFolderId
  /**
   * Sets the folder displayed in the mail tab. Requires the <permission>accountsRead</permission> permission. The previous message selection in the given folder will be restored, if any. This property is ignored, if <var>selectedMessages</var> is specified.
  */
    displayedFolder?:  folders.MailFolderId |  folders.MailFolder

  }

  export interface QuickFilterTextDetail {
  /**
   * String to match against the <var>recipients</var>, <var>author</var>, <var>subject</var>, or <var>body</var>.
  */
    text: string
  /**
   * Shows messages where <var>text</var> matches the recipients.
  */
    recipients?: boolean
  /**
   * Shows messages where <var>text</var> matches the author.
  */
    author?: boolean
  /**
   * Shows messages where <var>text</var> matches the subject.
  */
    subject?: boolean
  /**
   * Shows messages where <var>text</var> matches the message body.
  */
    body?: boolean

  }

  /**
 * Gets all mail tabs that have the specified properties, or all mail tabs if no properties are specified.
  */
  function query(queryInfo?: {
    /**
   * Whether the tabs are active in their windows.
  */
    active?: boolean
  /**
   * Whether the tabs are in the current window.
  */
    currentWindow?: boolean
  /**
   * Whether the tabs are in the last focused window.
  */
    lastFocusedWindow?: boolean
  /**
   * The ID of the parent window, or $(ref:windows.WINDOW_ID_CURRENT) for the current window.
  */
    windowId?: number

  }): Promise<mailTabs.MailTab[] | null>;
  /**
 * Get the $(ref:mailTabs.MailTab) properties of a mail tab.
  */
  function get(/**
 * ID of the requested mail tab. Throws if the requested <var>tabId</var> does not belong to a mail tab.
  */

tabId: number): Promise< mailTabs.MailTab | null>;
  /**
 * Get the $(ref:mailTabs.MailTab) properties of the active mail tab. Returns <var>undefined</var>, if the active tab is not a mail tab.
  */
  function getCurrent(): Promise< mailTabs.MailTab | null>;
  /**
 * Creates a new mail tab. Standard tab properties can be adjusted via $(ref:tabs.update) after the mail tab has been created. **Note:** A new mail window can be created via $(ref:windows.create).
  */
  function create(createProperties?:  mailTabs.MailTabProperties): Promise< mailTabs.MailTab | null>;
  /**
 * Modifies the properties of a mail tab. Properties that are not specified in <var>updateProperties</var> are not modified.
  */
  function update(/**
 * Defaults to the active tab of the current window.
  */

tabId: number, updateProperties:  mailTabs.MailTabProperties): Promise< mailTabs.MailTab | null>;
  function update(updateProperties:  mailTabs.MailTabProperties): Promise< mailTabs.MailTab | null>;
  /**
 * Lists the messages in the current view, honoring sort order and filters.
  */
  function getListedMessages(/**
 * Defaults to the active tab of the current window.
  */

tabId?: number): Promise< messages.MessageList | null>;
  /**
 * Lists the selected folders in the folder pane.
  */
  function getSelectedFolders(/**
 * Defaults to the active tab of the current window.
  */

tabId?: number): Promise<folders.MailFolder[] | null>;
  /**
 * Lists the selected messages in the current folder.
  */
  function getSelectedMessages(/**
 * Defaults to the active tab of the current window.
  */

tabId?: number): Promise< messages.MessageList | null>;
  /**
 * Selects none, one or multiple messages.
  */
  function setSelectedMessages(/**
 * Defaults to the active tab of the current window.
  */

tabId: number, /**
 * The IDs of the messages, which should be selected. The mail tab will switch to the folder of the selected messages. Throws if they belong to different folders. Array can be empty to deselect any currently selected message.
  */

messageIds: messages.MessageId[]): Promise<any>;
  function setSelectedMessages(/**
 * The IDs of the messages, which should be selected. The mail tab will switch to the folder of the selected messages. Throws if they belong to different folders. Array can be empty to deselect any currently selected message.
  */

messageIds: messages.MessageId[]): Promise<any>;
  /**
 * Sets the Quick Filter user interface based on the options specified.
  */
  function setQuickFilter(/**
 * Defaults to the active tab of the current window.
  */

tabId: number, properties: {
    /**
   * Shows or hides the Quick Filter bar.
  */
    show?: boolean
  /**
   * Shows only unread messages.
  */
    unread?: boolean
  /**
   * Shows only flagged messages.
  */
    flagged?: boolean
  /**
   * Shows only messages from people in the address book.
  */
    contact?: boolean
  /**
   * Shows only messages with tags on them.
  */
    tags?: boolean |  messages.tags.TagsDetail
  /**
   * Shows only messages with attachments.
  */
    attachment?: boolean
  /**
   * Shows only messages matching the supplied text.
  */
    text?:  mailTabs.QuickFilterTextDetail

  }): Promise<any>;
  function setQuickFilter(properties: {
    /**
   * Shows or hides the Quick Filter bar.
  */
    show?: boolean
  /**
   * Shows only unread messages.
  */
    unread?: boolean
  /**
   * Shows only flagged messages.
  */
    flagged?: boolean
  /**
   * Shows only messages from people in the address book.
  */
    contact?: boolean
  /**
   * Shows only messages with tags on them.
  */
    tags?: boolean |  messages.tags.TagsDetail
  /**
   * Shows only messages with attachments.
  */
    attachment?: boolean
  /**
   * Shows only messages matching the supplied text.
  */
    text?:  mailTabs.QuickFilterTextDetail

  }): Promise<any>;
    const onDisplayedFolderChanged: EventHandler<  /**
 * Fired when the displayed folder changes in any mail tab.
  */
  ((tab:  tabs.Tab, displayedFolder:  folders.MailFolder) => void)>;
    const onSelectedMessagesChanged: EventHandler<  /**
 * Fired when the selected messages change in any mail tab.
  */
  ((tab:  tabs.Tab, selectedMessages:  messages.MessageList) => void)>;
}

  /**
 * Use a composeAction to put a button in the message composition toolbars. In addition to its icon, a composeAction button can also have a tooltip, a badge, and a popup.
  */
declare namespace browser.composeAction {
  /**
 * An array of four integers in the range [0,255] that make up the RGBA color. For example, opaque red is <var>[255, 0, 0, 255]</var>.
  */
  type ColorArray = number[];
  /**
 * Pixel data for an image. Must be an <a href='url-image-data'>ImageData</a> object (for example, from a <a href='url-canvas-element'>canvas</a> element).
  */
  export interface ImageDataType {
  }

  /**
 * A *dictionary object* to specify multiple <a href='url-image-data'>ImageData</a> objects in different sizes, so the icon does not have to be scaled for a device with a different pixel density. Each entry is a *name-value* pair with *value* being an <a href='url-image-data'>ImageData</a> object, and *name* its size. Example: <literalinclude>includes/ImageDataDictionary.json<lang>JavaScript</lang></literalinclude>See the <a href='url-mdn-icon-size'>MDN documentation about choosing icon sizes</a> for more information on this.
  */
  export interface ImageDataDictionary {
  }

  /**
 * Information sent when a composeAction button is clicked.
  */
  export interface OnClickData {
  /**
   * An array of keyboard modifiers that were held while the menu item was clicked.
  */
    modifiers: 'Shift'
 | 'Alt'
 | 'Command'
 | 'Ctrl'
 | 'MacCtrl'[]
  /**
   * An integer value of button by which menu item was clicked.
  */
    button?: number

  }

  /**
 * Sets the title of the composeAction button. Is used as tooltip and as the label.
  */
  function setTitle(details: {
    /**
   * A string the composeAction button should display as its label and when moused over. Cleared by setting it to <var>null</var> or an empty string (title defined the manifest will be used).
  */
    title: string | void /* could not determine correct type */
  /**
   * Sets the title only for the given tab.
  */
    tabId?: number

  }): Promise<void | null>;
  /**
 * Gets the title of the composeAction button.
  */
  function getTitle(details: {
    /**
   * Specifies for which tab the title should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<string | null>;
  /**
 * Sets the label of the composeAction button. Can be used to set different values for the tooltip (defined by the title) and the label. Additionally, the label can be set to an empty string, not showing any label at all.
  */
  function setLabel(details: {
    /**
   * A string the composeAction button should use as its label, overriding the defined title. Can be set to an empty string to not display any label at all. If the containing toolbar is configured to display text only, its title will be used. Cleared by setting it to <var>null</var>.
  */
    label: string | void /* could not determine correct type */
  /**
   * Sets the label only for the given tab.
  */
    tabId?: number

  }): Promise<void | null>;
  /**
 * Gets the label of the composeAction button. Returns <var>null</var>, if no label has been set and the title is used.
  */
  function getLabel(details: {
    /**
   * Specifies for which tab the label should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<string | void /* could not determine correct type */ | null>;
  /**
 * Sets the icon for the composeAction button. Either the <var>path</var> or the <var>imageData</var> property must be specified.
  */
  function setIcon(details: {
    /**
   * The image data for one or more icons for the composeAction button.
  */
    imageData?: ImageDataType | ImageDataDictionary
  /**
   * The paths to one or more icons for the composeAction button.
  */
    path?:  manifest.IconPath
  /**
   * Sets the icon only for the given tab.
  */
    tabId?: number

  }): Promise<void | null>;
  /**
 * Sets the html document to be opened as a popup when the user clicks on the composeAction button.
  */
  function setPopup(details: {
    /**
   * The html file to show in a popup. Can be set to an empty string to not open a popup. Cleared by setting it to <var>null</var> (action will use the popup value defined in the manifest).
  */
    popup: string | void /* could not determine correct type */
  /**
   * Sets the popup only for the given tab.
  */
    tabId?: number

  }): Promise<void | null>;
  /**
 * Gets the html document set as the popup for this composeAction button.
  */
  function getPopup(details: {
    /**
   * Specifies for which tab the popup document should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<string | null>;
  /**
 * Sets the badge text for the composeAction button. The badge is displayed on top of the icon.
  */
  function setBadgeText(details: {
    /**
   * Any number of characters can be passed, but only about four can fit in the space. Cleared by setting it to <var>null</var> or an empty string.
  */
    text: string | void /* could not determine correct type */
  /**
   * Sets the badge text only for the given tab.
  */
    tabId?: number

  }): Promise<void | null>;
  /**
 * Gets the badge text of the composeAction button.
  */
  function getBadgeText(details: {
    /**
   * Specifies for which tab the badge text should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<string | null>;
  /**
 * Sets the text color for the badge.
  */
  function setBadgeTextColor(details: {
    /**
   * The color to use as text color in the badge. Cleared by setting it to <var>null</var>.
  */
    color: string | ColorArray | void /* could not determine correct type */
  /**
   * Sets the text color for the badge only for the given tab.
  */
    tabId?: number

  }): Promise<any>;
  /**
 * Gets the text color of the badge.
  */
  function getBadgeTextColor(details: {
    /**
   * Specifies for which tab the badge text color should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<spacesToolbar.ColorArray | null>;
  /**
 * Sets the background color for the badge.
  */
  function setBadgeBackgroundColor(details: {
    /**
   * The color to use as background in the badge. Cleared by setting it to <var>null</var>.
  */
    color: string | ColorArray | void /* could not determine correct type */
  /**
   * Sets the background color for the badge only for the given tab.
  */
    tabId?: number

  }): Promise<void | null>;
  /**
 * Gets the badge background color of the composeAction button.
  */
  function getBadgeBackgroundColor(details: {
    /**
   * Specifies for which tab the badge background color should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<spacesToolbar.ColorArray | null>;
  /**
 * Enables the composeAction button for a specific tab (if a <var>tabId</var> is provided), or for all tabs which do not have a custom enable state. Once the enable state of a tab has been updated individually, all further changes to its state have to be done individually as well. By default, a composeAction button is enabled.
  */
  function enable(/**
 * The id of the tab for which you want to modify the composeAction button.
  */

tabId?: number): Promise<void | null>;
  /**
 * Disables the composeAction button for a specific tab (if a <var>tabId</var> is provided), or for all tabs which do not have a custom enable state. Once the enable state of a tab has been updated individually, all further changes to its state have to be done individually as well.
  */
  function disable(/**
 * The id of the tab for which you want to modify the composeAction button.
  */

tabId?: number): Promise<void | null>;
  /**
 * Checks whether the composeAction button is enabled.
  */
  function isEnabled(details: {
    /**
   * Specifies for which tab the state should be retrieved. If no tab is specified, the global value is retrieved.
  */
    tabId?: number

  }): Promise<boolean | null>;
  /**
 * Opens the action's popup window in the specified window. Defaults to the current window. Returns false if the popup could not be opened because the action has no popup, is of type <var>menu</var>, is disabled or has been removed from the toolbar.
  */
  function openPopup(/**
 * An object with information about the popup to open.
  */

options?: {
    /**
   * Defaults to the current window.
  */
    windowId?: number

  }): Promise<boolean | null>;
    const onClicked: EventHandler<  /**
 * Fired when a composeAction button is clicked. This event will not fire if the composeAction has a popup. This is a user input event handler. For asynchronous listeners some <a href='url-user-input-restrictions'>restrictions</a> apply.
  */
  ((tab:  tabs.Tab, info?: OnClickData) => void)>;
}

declare namespace browser.identities {
  export interface EncryptionCapabilities {
  /**
   * Whether the encryption technology is configured to support message encryption.
  */
    canEncrypt: boolean
  /**
   * Whether the encryption technology is configured to support message signing.
  */
    canSign: boolean

  }

  export interface MailIdentity {
  /**
   * The id of the $(ref:accounts.MailAccount) this identity belongs to. The <var>accountId</var> property is read-only.
  */
    accountId?:  accounts.MailAccountId
  /**
   * If the identity uses HTML as the default compose format.
  */
    composeHtml?: boolean
  /**
   * The user's email address as used when messages are sent from this identity.
  */
    email?: string
  /**
   * A unique identifier for this identity. The <var>id</var> property is read-only.
  */
    id?: string
  /**
   * A user-defined label for this identity.
  */
    label?: string
  /**
   * The user's name as used when messages are sent from this identity.
  */
    name?: string
  /**
   * The reply-to email address associated with this identity.
  */
    replyTo?: string
  /**
   * The organization associated with this identity.
  */
    organization?: string
  /**
   * The signature of the identity.
  */
    signature?: string
  /**
   * If the signature should be interpreted as plain text or as HTML.
  */
    signatureIsPlainText?: boolean
  /**
   * The encryption capabilities of this identity. Read only.
  */
    encryptionCapabilities?: {
    /**
   * The capabilities of this identity for the OpenPGP encryption technology.
  */
    OpenPGP:  identities.EncryptionCapabilities
  /**
   * The capabilities of this identity for the S/MIME encryption technology.
  */
    SMIME:  identities.EncryptionCapabilities

  }

  }

  /**
 * Returns the identities of the specified account, or all identities if no account is specified. Do not expect the returned identities to be in any specific order. Use $(ref:identities.getDefault) to get the default identity of an account.
  */
  function list(accountId?:  accounts.MailAccountId): Promise<identities.MailIdentity[] | null>;
  /**
 * Returns details of the requested identity, or <var>null</var> if it doesn't exist.
  */
  function get(identityId: string): Promise< identities.MailIdentity | void /* could not determine correct type */ | null>;
  /**
 * Create a new identity in the specified account.
  */
  function create(accountId:  accounts.MailAccountId, details:  identities.MailIdentity): Promise< identities.MailIdentity | null>;
  /**
 * Updates the details of an identity.
  */
  function update(identityId: string, details:  identities.MailIdentity): Promise< identities.MailIdentity | null>;
  /**
 * Returns the default identity for the requested account, or <var>null</var> if it is not defined.
  */
  function getDefault(accountId:  accounts.MailAccountId): Promise< identities.MailIdentity | void /* could not determine correct type */ | null>;
  /**
 * Sets the default identity for the requested account.
  */
  function setDefault(accountId:  accounts.MailAccountId, identityId: string): Promise<any>;
    const onCreated: EventHandler<  /**
 * Fired when a new identity has been created and added to an account. The event also fires for default identities that are created when a new account is added.
  */
  ((identityId: string, identity: MailIdentity) => void)>;
    const onDeleted: EventHandler<  /**
 * Fired when an identity has been removed from an account.
  */
  ((identityId: string) => void)>;
    const onUpdated: EventHandler<  /**
 * Fired when one or more properties of an identity have been modified. The returned $(ref:identities.MailIdentity) includes only the changed values.
  */
  ((identityId: string, changedValues: MailIdentity) => void)>;
}

declare namespace browser.messages {
  /**
 * A unique id representing a $(ref:messages.MessageHeader) and the associated message. This id doesn’t refer to the Message-ID email header. It is an internal tracking number that does not remain after a restart. Nor does it follow an email that has been moved to a different folder.
  */
  type MessageId = number;
  /**
 * An inline part with content type <var>text/*</var>. These parts are not returned by $(ref:messages.listAttachments) and usually make up the readable content of the message, mostly with content type <var>text/plain</var> or <var>text/html</var>
  */
  export interface InlineTextPart {
  /**
   * The content type of the part. Most common types for inline text parts are <var>text/plain</var> and <var>text/html</var>. Possible other (deprecated) types are <var>text/richtext</var> and <var>text/enriched</var>. Some calendaring services include an inline text part with type <var>text/calendar</var>.
  */
    contentType: string
  /**
   * The content of this inline text part.
  */
    content: string

  }

  /**
 * Basic information about a message.
  */
  export interface MessageHeader {
    author: string
  /**
   * The Bcc recipients. Not populated for news/nntp messages.
  */
    bccList: string[]
  /**
   * The Cc recipients. Not populated for news/nntp messages.
  */
    ccList: string[]
    date:  extensionTypes.Date
  /**
   * Whether this message is a real message or an external message (opened from a file or from an attachment).
  */
    external: boolean
  /**
   * Whether this message is flagged (a.k.a. starred).
  */
    flagged: boolean
  /**
   * The <permission>accountsRead</permission> permission is required for this property to be included. Not available for external or attached messages.
  */
    folder?:  folders.MailFolder
  /**
   * The message-id header of the message.
  */
    headerMessageId: string
  /**
   * Some account types (for example <var>pop3</var>) allow to download only the headers of the message, but not its body. The body of such messages will not be available.
  */
    headersOnly: boolean
    id:  messages.MessageId
  /**
   * Whether the message has been marked as junk. Always <var>false</var> for news/nntp messages and external messages.
  */
    junk: boolean
  /**
   * The junk score associated with the message. Always <var>0</var> for news/nntp messages and external messages.
  */
    junkScore: number
  /**
   * Whether the message has been marked as read. Not available for external or attached messages.
  */
    read?: boolean
  /**
   * Whether the message has been received recently and is marked as new.
  */
    new: boolean
  /**
   * The To recipients. Not populated for news/nntp messages.
  */
    recipients: string[]
  /**
   * The total size of the message in bytes.
  */
    size: number
  /**
   * The subject of the message.
  */
    subject: string
  /**
   * Tags associated with this message. For a list of available tags, use $(ref:messages.tags.list).
  */
    tags: string[]

  }

  /**
 * See $(doc:examples/messageLists) for more information.
  */
  export interface MessageList {
  /**
   * Id of the message list, to be used with $(ref:messages.continueList) or $(ref:messages.abortList).
  */
    id: string | void /* could not determine correct type */
    messages: messages.MessageHeader[]

  }

  /**
 * Represents an email message "part", which could be the whole message.
  */
  export interface MessagePart {
  /**
   * The content of the part.
  */
    body?: string
    contentType?: string
  /**
   * The decryption status, only available for the root part.
  */
    decryptionStatus?: 'none'
 | 'skipped'
 | 'success'
 | 'fail'
  /**
   * A *dictionary object* of part headers as *key-value* pairs, with the header name as *key*, and an array of headers as *value*.
  */
    headers?: /* "unknown" undefined */ object
  /**
   * Name of the part, if it is a file.
  */
    name?: string
  /**
   * The identifier of this part, used in $(ref:messages.getAttachmentFile).
  */
    partName?: string
  /**
   * Any sub-parts of this part.
  */
    parts?: messages.MessagePart[]
  /**
   * The size of this part. The size of parts with content type *message/rfc822* is not the actual message size (on disc), but the total size of its decoded body parts, excluding headers.
  */
    size?: number

  }

  /**
 * Message properties used in $(ref:messages.update) and $(ref:messages.import). They can also be monitored by $(ref:messages.onUpdated).
  */
  export interface MessageProperties {
  /**
   * Whether the message is flagged (a.k.a starred).
  */
    flagged?: boolean
  /**
   * Whether the message is marked as junk. Only supported in $(ref:messages.update).
  */
    junk?: boolean
  /**
   * Whether the message is marked as new. Only supported in $(ref:messages.import).
  */
    new?: boolean
  /**
   * Whether the message is marked as read.
  */
    read?: boolean
  /**
   * Tags associated with this message. For a list of available tags, call the $(ref:messages.tags.list) method.
  */
    tags?: string[]

  }

  /**
 * Represents an attachment in a message. This includes all MIME parts with a *content-disposition* header set to <var>attachment</var>, but also related parts like inline images.
  */
  export interface MessageAttachment {
  /**
   * The content type of the attachment. A value of <var>text/x-moz-deleted</var> indicates that the original attachment was permanently deleted and replaced by a placeholder text attachment with some meta information about the original attachment.
  */
    contentType: string
  /**
   * The name, as displayed to the user, of this attachment. This is usually but not always the filename of the attached file.
  */
    name: string
  /**
   * Identifies the MIME part of the message associated with this attachment.
  */
    partName: string
  /**
   * The size in bytes of this attachment.
  */
    size: number
  /**
   * The content-id of this part. Available for related parts, which are referenced from other places inside the same message (e.g. inline images).
  */
    contentId?: string
  /**
   * A MessageHeader, if this attachment is a message.
  */
    message?:  messages.MessageHeader

  }

  /**
 * An object defining a range.
  */
  export interface QueryRange {
  /**
   * The minimum value required to match the query.
  */
    min?: number
  /**
   * The maximum value required to match the query.
  */
    max?: number

  }

  /**
 * Gets all messages in a folder.
  */
  function list(folderId:  folders.MailFolderId): Promise< messages.MessageList | null>;
  /**
 * Gets all messages in a folder.
  */
  function list(folder:  folders.MailFolderId |  folders.MailFolder): Promise< messages.MessageList | null>;
  /**
 * Returns the next chunk of messages in a list. See $(doc:examples/messageLists) for more information.
  */
  function continueList(messageListId: string): Promise< messages.MessageList | null>;
  /**
 * Finalizes the specified list and terminates any process currently still adding messages.
  */
  function abortList(messageListId: string): Promise<any>;
  /**
 * Returns the specified message.
  */
  function get(messageId:  messages.MessageId): Promise< messages.MessageHeader | null>;
  /**
 * Returns the specified message, including all headers and MIME parts. Throws if the message could not be read, for example due to network issues.
  */
  function getFull(messageId:  messages.MessageId, options?: {
    /**
   * Whether the message should be decrypted. If the message could not be decrypted, its parts are omitted. Defaults to true.
  */
    decrypt?: boolean

  }): Promise< messages.MessagePart | null>;
  /**
 * Returns the unmodified source of a message. Throws if the message could not be read, for example due to network issues.
  */
  function getRaw(messageId:  messages.MessageId, options?: {
    /**
   * Whether the message should be decrypted. Throws, if the message could not be decrypted.
  */
    decrypt?: boolean
    data_format?: 'File'
 | 'BinaryString' | 'File'
 | 'BinaryString'

  }): Promise<string | /* "unknown" undefined */ object | null>;
  /**
 * Lists the attachments of a message.
  */
  function listAttachments(messageId:  messages.MessageId): Promise<messages.MessageAttachment[] | null>;
  /**
 * Lists all inline text parts of a message. These parts are not returned by $(ref:messages.listAttachments) and usually make up the readable content of the message, mostly with content type <var>text/plain</var> or <var>text/html</var>. If a message only includes a part with content type <var>text/html</var>, the method $(ref:messengerUtilities.convertToPlainText) can be used to retreive a plain text version. 

**Note:** A message usually contains only one inline text part per subtype, but technically messages can contain multiple inline text parts per subtype.
  */
  function listInlineTextParts(messageId:  messages.MessageId): Promise<messages.InlineTextPart[] | null>;
  /**
 * Gets the content of a $(ref:messages.MessageAttachment) as a <a href='url-dom-file'>File</a> object.
  */
  function getAttachmentFile(messageId:  messages.MessageId, partName: string): Promise</* "unknown" undefined */ object | null>;
  /**
 * Deletes the specified attachments and replaces them by placeholder text attachments with meta information about the original attachments and a <var>text/x-moz-deleted</var> content type. This permanently modifies the message.
  */
  function deleteAttachments(messageId: number, /**
 * An array of attachments, identifying the to be deleted attachments by their <var>partName</var>.
  */

partNames: string[]): Promise<any>;
  /**
 * Opens the specified attachment.
  */
  function openAttachment(messageId:  messages.MessageId, partName: string, /**
 * The ID of the tab associated with the message opening.
  */

tabId: number): Promise<any>;
  /**
 * Gets all messages that have the specified properties, or all messages if no properties are specified. Messages of unified mailbox folders are not included by default (as that could double the amount of returned messages), but explicitly specifying a unified mailbox folder is supported.
  */
  function query(queryInfo?: {
    /**
   * Limits the search to the specified account(s). Accounts are searched in the specified order.
  */
    accountId?:  accounts.MailAccountId | accounts.MailAccountId[]
  /**
   * Whether the message has attachments, or not. Supports to specify a $(ref:messages.QueryRange) (min/max) instead of a simple boolean value (none/some).
  */
    attachment?: boolean | QueryRange
  /**
   * Returns only messages with this value matching the author. The search value is a single email address, a name or a combination (e.g.: <var>Name <user@domain.org></var>). The address part of the search value (if provided) must match the author's address completely. The name part of the search value (if provided) must match the author's name partially. All matches are done case-insensitive.
  */
    author?: string
  /**
   * Returns only messages with this value in the body of the mail.
  */
    body?: string
  /**
   * Returns only flagged (or unflagged if false) messages.
  */
    flagged?: boolean
  /**
   * Limits the search to the specified folder(s). Folders are searched in the specified order. The <permission>accountsRead</permission> permission is required.
  */
    folderId?:  folders.MailFolderId | folders.MailFolderId[]
  /**
   * Returns only messages from the specified folder. The <permission>accountsRead</permission> permission is required.
  */
    folder?:  folders.MailFolder
  /**
   * Returns only messages with a date after this value.
  */
    fromDate?:  extensionTypes.Date
  /**
   * Returns only messages with the author's address matching any configured identity.
  */
    fromMe?: boolean
  /**
   * Returns only messages with this value somewhere in the mail (subject, body or author).
  */
    fullText?: string
  /**
   * Returns only messages with a Message-ID header matching this value.
  */
    headerMessageId?: string
  /**
   * Search the specified folder recursively.
  */
    includeSubFolders?: boolean
  /**
   * Query the server directly instead of the local message database. Online queries currently only support querying the `headerMessageId` property. Currently only supported for NNTP accounts.
  */
    online?: boolean
  /**
   * Returns only messages whose recipients match all specified addresses. The search value is a semicolon separated list of email addresses, names or combinations (e.g.: <var>Name <user@domain.org></var>). For a match, all specified addresses must equal a recipient's address completely and all specified names must match a recipient's name partially. All matches are done case-insensitive.
  */
    recipients?: string
  /**
   * Returns only messages with a size in the specified byte range.
  */
    size?: QueryRange
  /**
   * Returns only messages whose subject contains the provided string.
  */
    subject?: string
  /**
   * Returns only messages with the specified tags. For a list of available tags, call the $(ref:messages.tags.list) method.
  */
    tags?:  messages.tags.TagsDetail
  /**
   * Returns only messages with a date before this value.
  */
    toDate?:  extensionTypes.Date
  /**
   * Returns only messages with at least one recipient address matching any configured identity.
  */
    toMe?: boolean
  /**
   * Returns only messages whith the specified junk state.
  */
    junk?: boolean
  /**
   * Returns only messages with a junk score in the specified range.
  */
    junkScore?: QueryRange
  /**
   * Returns only messages with the specified new state.
  */
    new?: boolean
  /**
   * Returns only unread (or read if false) messages.
  */
    unread?: boolean
  /**
   * Returns only messages with the specified read state.
  */
    read?: boolean
  /**
   * Set the timeout in ms after which results should be returned, even if the nominal number of messages-per-page has not yet been reached. Defaults to <var>1000</var> ms. Setting it to <var>0</var> will disable auto-pagination.
  */
    autoPaginationTimeout?: number
  /**
   * Set the nominal number of messages-per-page for this query. Defaults to <var>100</var> messages.
  */
    messagesPerPage?: number
  /**
   * The *messageListId* is usually returned together with the first page, after some messages have been found. Enabling this option will change the return value of this function and return the *messageListId* directly.
  */
    returnMessageListId?: boolean

  }): Promise< messages.MessageList | string | null>;
  /**
 * Updates message properties and tags. Updating external messages will throw an *ExtensionError*.
  */
  function update(messageId:  messages.MessageId, newProperties:  messages.MessageProperties): Promise<any>;
  /**
 * Moves messages to a specified folder. If the messages cannot be removed from the source folder, they will be copied instead of moved. Moving external messages will throw an *ExtensionError*.
  */
  function move(/**
 * The IDs of the messages to move.
  */

messageIds: messages.MessageId[], /**
 * The folder to move the messages to.
  */

destination:  folders.MailFolderId |  folders.MailFolder): Promise<any>;
  /**
 * Moves messages to a specified folder. If the messages cannot be removed from the source folder, they will be copied instead of moved. Moving external messages will throw an *ExtensionError*.
  */
  function move(/**
 * The IDs of the messages to move.
  */

messageIds: messages.MessageId[], /**
 * The folder to move the messages to.
  */

folderId:  folders.MailFolderId): Promise<any>;
  /**
 * Copies messages to a specified folder.
  */
  function copy(/**
 * The IDs of the messages to copy.
  */

messageIds: messages.MessageId[], /**
 * The folder to copy the messages to.
  */

destination:  folders.MailFolderId |  folders.MailFolder): Promise<any>;
  /**
 * Copies messages to a specified folder.
  */
  function copy(/**
 * The IDs of the messages to copy.
  */

messageIds: messages.MessageId[], /**
 * The folder to copy the messages to.
  */

folderId:  folders.MailFolderId): Promise<any>;
  /**
 * Imports a message into a local Thunderbird folder. To import a message into an IMAP folder, add it to a local folder first and then move it to the IMAP folder.
  */
  function __import(file: /* "unknown" undefined */ object, /**
 * The folder to import the messages into.
  */

destination:  folders.MailFolderId |  folders.MailFolder, properties?:  messages.MessageProperties): Promise< messages.MessageHeader | null>;
  /**
 * Imports a message into a local Thunderbird folder. To import a message into an IMAP folder, add it to a local folder first and then move it to the IMAP folder.
  */
  function __import(file: /* "unknown" undefined */ object, /**
 * The folder to import the messages into.
  */

folderId:  folders.MailFolderId, properties?:  messages.MessageProperties): Promise< messages.MessageHeader | null>;
  /**
 * Archives messages using the current settings. Archiving external messages will throw an *ExtensionError*.
  */
  function archive(/**
 * The IDs of the messages to archive.
  */

messageIds: messages.MessageId[]): Promise<any>;
  /**
 * Returns a list of tags that can be set on messages, and their human-friendly name, colour, and sort order.
  */
  function listTags(): Promise<messages.tags.MessageTag[] | null>;
  /**
 * Creates a new message tag. Tagging a message will store the tag's key in the user's message. Throws if the specified tag key is used already.
  */
  function createTag(/**
 * Unique tag identifier (will be converted to lower case). Must not include <var>()<>{/%*"</var> or spaces.
  */

key: string, /**
 * Human-readable tag name.
  */

tag: string, /**
 * Tag color in hex format (i.e.: <var>#000080</var> for navy blue). Value will be stored as upper case.
  */

color: string): Promise<any>;
  /**
 * Updates a message tag. Throws if the specified tag key does not exist.
  */
  function updateTag(/**
 * Unique tag identifier (will be converted to lower case). Must not include <var>()<>{/%*"</var> or spaces.
  */

key: string, updateProperties: {
    /**
   * Human-readable tag name.
  */
    tag?: string
  /**
   * Tag color in hex format (i.e.: #000080 for navy blue). Value will be stored as upper case.
  */
    color?: string

  }): Promise<any>;
  /**
 * Deletes a message tag, removing it from the list of known tags. Its key will not be removed from tagged messages, but they will appear untagged. Recreating a deleted tag, will make all former tagged messages appear tagged again.
  */
  function deleteTag(/**
 * Unique tag identifier (will be converted to lower case). Must not include <var>()<>{/%*"</var> or spaces.
  */

key: string): Promise<any>;
    const onUpdated: EventHandler<  /**
 * Fired when one or more properties of a message have been updated.
  */
  ((message:  messages.MessageHeader, changedProperties:  messages.MessageProperties) => void)>;
    const onMoved: EventHandler<  /**
 * Fired when messages have been moved.
  */
  ((originalMessages:  messages.MessageList, movedMessages:  messages.MessageList) => void)>;
    const onCopied: EventHandler<  /**
 * Fired when messages have been copied.
  */
  ((originalMessages:  messages.MessageList, copiedMessages:  messages.MessageList) => void)>;
    const onDeleted: EventHandler<  /**
 * Fired when messages have been permanently deleted.
  */
  ((messages:  messages.MessageList) => void)>;
    const onNewMailReceived: EventHandler<  /**
 * Fired when a new message is received, and has been through junk classification and message filters.
  */
  ((folder:  folders.MailFolder, messages:  messages.MessageList) => void)>;
}

declare namespace browser.messages.tags {
  export interface MessageTag {
  /**
   * Unique tag identifier.
  */
    key: string
  /**
   * Human-readable tag name.
  */
    tag: string
  /**
   * Tag color.
  */
    color: string
  /**
   * Custom sort string (usually empty).
  */
    ordinal: string

  }

  /**
 * Used for filtering messages by tag in various methods. Note that functions using this type may have a partial implementation.
  */
  export interface TagsDetail {
  /**
   * A *dictionary object* with one or more filter condition as *key-value* pairs, the *key* being the tag to filter on, and the *value* being a boolean expression, requesting whether a message must include (<var>true</var>) or exclude (<var>false</var>) the tag. For a list of available tags, call the $(ref:messages.tags.list) method.
  */
    tags: /* "unknown" undefined */ object
  /**
   * Whether all of the tag filters must apply, or any of them.
  */
    mode: 'all'
 | 'any'

  }

  /**
 * Returns a list of tags that can be set on messages, and their human-friendly name, colour, and sort order.
  */
  function list(): Promise<messages.tags.MessageTag[] | null>;
  /**
 * Creates a new message tag. Tagging a message will store the tag's key in the user's message. Throws if the specified tag key is used already.
  */
  function create(/**
 * Unique tag identifier (will be converted to lower case). Must not include <var>()<>{/%*"</var> or spaces.
  */

key: string, /**
 * Human-readable tag name.
  */

tag: string, /**
 * Tag color in hex format (i.e.: #000080 for navy blue). Value will be stored as upper case.
  */

color: string): Promise<any>;
  /**
 * Updates a message tag. Throws if the specified tag key does not exist.
  */
  function update(/**
 * Unique tag identifier (will be converted to lower case). Must not include <var>()<>{/%*"</var> or spaces.
  */

key: string, updateProperties: {
    /**
   * Human-readable tag name.
  */
    tag?: string
  /**
   * Tag color in hex format (i.e.: #000080 for navy blue). Value will be stored as upper case.
  */
    color?: string

  }): Promise<any>;
}

declare namespace browser.folders {
  /**
 * An object describing a folder.
  */
  export interface MailFolder {
  /**
   * The id of the account this folder belongs to.
  */
    accountId?:  accounts.MailAccountId
  /**
   * An identifier for the folder.
  */
    id?:  folders.MailFolderId
  /**
   * Whether this folder is a favorite folder.
  */
    isFavorite?: boolean
  /**
   * Whether this folder is a root folder.
  */
    isRoot?: boolean
  /**
   * Whether this folder is a virtual tag folder.
  */
    isTag?: boolean
  /**
   * Whether this folder is a unified mailbox folder.
  */
    isUnified?: boolean
  /**
   * Whether this folder is a virtual search folder.
  */
    isVirtual?: boolean
  /**
   * The human-friendly name of this folder.
  */
    name?: string
  /**
   * Path to this folder in the account. Although paths look predictable, never guess a folder's path, as there are a number of reasons why it may not be what you think it is. Use $(ref:folders.getParentFolders) or $(ref:folders.getSubFolders) to obtain hierarchy information.
  */
    path: string
  /**
   * The special use of this folder. A folder can have multiple special uses.
  */
    specialUse?: folders.MailFolderSpecialUse[]
  /**
   * Subfolders of this folder. The property may be <var>null</var>, if inclusion of folders had not been requested. The folders will be returned in the same order as used in Thunderbird's folder pane.
  */
    subFolders?: folders.MailFolder[] | void /* could not determine correct type */
  /**
   * Deprecated. Was used to represent the type of this folder.
  */
    type?:  folders.MailFolderSpecialUse

  }

  /**
 * A unique id representing a $(ref:folders.MailFolder) throughout a session. Renaming or moving a folder will invalidate its id.
  */
  /**
 * A unique id representing a $(ref:folders.MailFolder) throughout a session. Renaming or moving a folder will invalidate its id.
  */
  type MailFolderId = string;
  /**
 * An object containing additional information about a folder.
  */
  export interface MailFolderInfo {
  /**
   * Deprecated. This information is now available in $(ref:folders.MailFolder).
  */
    favorite?: boolean
  /**
   * Date the folder was last used (precision: seconds).
  */
    lastUsed?:  extensionTypes.Date
  /**
   * Quota information, if available.
  */
    quota?: folders.MailFolderQuota[]
  /**
   * Number of new messages in this folder.
  */
    newMessageCount?: number
  /**
   * Number of messages in this folder.
  */
    totalMessageCount?: number
  /**
   * Number of unread messages in this folder.
  */
    unreadMessageCount?: number

  }

  /**
 * An object containing capability information about a folder.
  */
  export interface MailFolderCapabilities {
  /**
   * Whether this folder supports adding new messages.
  */
    canAddMessages?: boolean
  /**
   * Whether this folder supports adding new subfolders.
  */
    canAddSubfolders?: boolean
  /**
   * Whether this folder can be deleted.
  */
    canBeDeleted?: boolean
  /**
   * Whether this folder can be renamed.
  */
    canBeRenamed?: boolean
  /**
   * Whether this folder supports deleting messages.
  */
    canDeleteMessages?: boolean

  }

  /**
 * Supported values for the special use of a folder.
  */
  /**
 * Supported values for the special use of a folder.
  */
  type MailFolderSpecialUse = string;
  /**
 * An object containing quota information.
  */
  export interface MailFolderQuota {
  /**
   * The type of the quota as defined by RFC2087. A <var>STORAGE</var> quota is constraining the available storage in bytes, a <var>MESSAGE</var> quota is constraining the number of storable messages.
  */
    type: 'STORAGE'
 | 'MESSAGE'
  /**
   * The maximum available quota.
  */
    limit: number
  /**
   * The currently used quota.
  */
    used: number
  /**
   * The currently unused quota.
  */
    unused: number

  }

  /**
 * An object defining a range.
  */
  export interface QueryRange {
  /**
   * The minimum value required to match the query.
  */
    min?: number
  /**
   * The maximum value required to match the query.
  */
    max?: number

  }

  export interface RegularExpression {
  /**
   * A regular expression, for example <var>^Projects \d{4}$</var>.
  */
    regexp: string
  /**
   * Supported RegExp flags: <var>i</var> = case insensitive, and/or one of <var>u</var> = unicode support or <var>v</var> = extended unicode support
  */
    flags?: string

  }

  /**
 * Gets folders that match the specified properties, or all folders if no properties are specified.
  */
  function query(queryInfo?: {
    /**
   * Limits the search to folders of the account with the specified id.
  */
    accountId?:  accounts.MailAccountId
  /**
   * Whether the folder supports adding new messages, or not.
  */
    canAddMessages?: boolean
  /**
   * Whether the folder supports adding new subfolders, or not.
  */
    canAddSubfolders?: boolean
  /**
   * Whether the folder can be deleted, or not.
  */
    canBeDeleted?: boolean
  /**
   * Whether the folder can be renamed, or not.
  */
    canBeRenamed?: boolean
  /**
   * Whether the folder supports deleting messages, or not.
  */
    canDeleteMessages?: boolean
  /**
   * Limits the search to the folder with the specified id.
  */
    folderId?:  folders.MailFolderId
  /**
   * Whether the folder (excluding subfolders) contains messages, or not. Supports to specify a $(ref:folders.QueryRange) (min/max) instead of a simple boolean value (none/some).
  */
    hasMessages?: boolean | QueryRange
  /**
   * Whether the folder (excluding subfolders) contains unread messages, or not. Supports to specify a $(ref:folders.QueryRange) (min/max) instead of a simple boolean value (none/some).
  */
    hasUnreadMessages?: boolean | QueryRange
  /**
   * Whether the folder (excluding subfolders) contains new messages, or not. Supports to specify a $(ref:folders.QueryRange) (min/max) instead of a simple boolean value (none/some).
  */
    hasNewMessages?: boolean | QueryRange
  /**
   * Whether the folder has subfolders, or not. Supports to specify a $(ref:folders.QueryRange) (min/max) instead of a simple boolean value (none/some).
  */
    hasSubFolders?: boolean | QueryRange
  /**
   * Whether the folder is a favorite folder, or not.
  */
    isFavorite?: boolean
  /**
   * Whether the folder is a root folder, or not.
  */
    isRoot?: boolean
  /**
   * Whether the folder is a virtual tag folder, or not. Note: Virtual tag folders are always skipped, unless this property is set to <var>true</var>
  */
    isTag?: boolean
  /**
   * Whether the folder is a unified mailbox folder, or not. Note: Unified mailbox folders are always skipped, unless this property is set to <var>true</var>
  */
    isUnified?: boolean
  /**
   * Whether the folder is a virtual search folder, or not.
  */
    isVirtual?: boolean
  /**
   * Limits the number of returned folders. If used together with <var>recent</var>, supports being set to $(ref:folders.DEFAULT_MOST_RECENT_LIMIT)
  */
    limit?: number
  /**
   * Return only folders whose name is matched by the provided string or regular expression.
  */
    name?: RegularExpression | string
  /**
   * Return only folders whose path is matched by the provided string or regular expression.
  */
    path?: RegularExpression | string
  /**
   * Whether the folder (excluding subfolders) has been used within the last month, or not. The returned folders will be sorted by their recentness.
  */
    recent?: boolean
  /**
   * Match only folders with the specified special use (folders have to match all specified uses).
  */
    specialUse?: folders.MailFolderSpecialUse[]
  /**
   * Deprecated. Match only folders with the specified special use.
  */
    type?:  folders.MailFolderSpecialUse

  }): Promise<folders.MailFolder[] | null>;
  /**
 * Returns the specified folder.
  */
  function get(folderId:  folders.MailFolderId, /**
 * Specifies whether the returned $(ref:folders.MailFolder) should populate its <var>subFolders</var> property and include all its (nested!) subfolders. Defaults to <var>false</var>.
  */

includeSubFolders?: boolean): Promise< folders.MailFolder | null>;
  /**
 * Returns the specified folder.
  */
  function get(folderId:  folders.MailFolderId, /**
 * Specifies whether the returned $(ref:folders.MailFolder) should populate its <var>subFolders</var> property and include all its (nested!) subfolders. Defaults to <var>true</var>.
  */

includeSubFolders?: boolean): Promise< folders.MailFolder | null>;
  /**
 * Creates a new subfolder in the specified folder.
  */
  function create(folderId:  folders.MailFolderId, childName: string): Promise< folders.MailFolder | null>;
  /**
 * Creates a new subfolder in the specified folder, or at the root of the specified account.
  */
  function create(destination:  folders.MailFolderId |  folders.MailFolder |  accounts.MailAccount, childName: string): Promise< folders.MailFolder | null>;
  /**
 * Renames a folder.
  */
  function rename(folder:  folders.MailFolderId |  folders.MailFolder, newName: string): Promise< folders.MailFolder | null>;
  /**
 * Renames a folder.
  */
  function rename(folderId:  folders.MailFolderId, newName: string): Promise< folders.MailFolder | null>;
  /**
 * Moves the given source folder into the given destination folder. Throws if the destination already contains a folder with the name of the source folder.
  */
  function move(source:  folders.MailFolderId |  folders.MailFolder, destination:  folders.MailFolderId |  folders.MailFolder |  accounts.MailAccount): Promise< folders.MailFolder | null>;
  /**
 * Moves the given source folder into the given destination folder. Throws if the destination already contains a folder with the name of the source folder.
  */
  function move(sourceFolderId:  folders.MailFolderId, destinationFolderId:  folders.MailFolderId): Promise< folders.MailFolder | null>;
  /**
 * Copies the given source folder into the given destination folder. Throws if the destination already contains a folder with the name of the source folder.
  */
  function copy(source:  folders.MailFolderId |  folders.MailFolder, destination:  folders.MailFolderId |  folders.MailFolder |  accounts.MailAccount): Promise< folders.MailFolder | null>;
  /**
 * Copies the given source folder into the given destination folder. Throws if the destination already contains a folder with the name of the source folder.
  */
  function copy(sourceFolderId:  folders.MailFolderId, destinationFolderId:  folders.MailFolderId): Promise< folders.MailFolder | null>;
  /**
 * Updates properties of a folder.
  */
  function update(folder:  folders.MailFolderId |  folders.MailFolder, /**
 * The properties to update.
  */

updateProperties: {
    /**
   * Sets or clears the favorite status.
  */
    isFavorite?: boolean

  }): Promise<any>;
  /**
 * Updates properties of a folder.
  */
  function update(folderId:  folders.MailFolderId, /**
 * The properties to update.
  */

updateProperties: {
    /**
   * Sets or clears the favorite status.
  */
    isFavorite?: boolean

  }): Promise<any>;
  /**
 * Get additional information about a folder.
  */
  function getFolderInfo(folder:  folders.MailFolderId |  folders.MailFolder): Promise< folders.MailFolderInfo | null>;
  /**
 * Get additional information about a folder.
  */
  function getFolderInfo(folderId:  folders.MailFolderId): Promise< folders.MailFolderInfo | null>;
  /**
 * Get capability information about a folder.
  */
  function getFolderCapabilities(folder:  folders.MailFolderId |  folders.MailFolder): Promise< folders.MailFolderCapabilities | null>;
  /**
 * Get capability information about a folder.
  */
  function getFolderCapabilities(folderId:  folders.MailFolderId): Promise< folders.MailFolderCapabilities | null>;
  /**
 * Get all parent folders as a flat ordered array. The first array entry is the direct parent.
  */
  function getParentFolders(folder:  folders.MailFolderId |  folders.MailFolder, /**
 * Specifies whether each returned parent $(ref:folders.MailFolder) should populate its <var>subFolders</var> property and include all its (nested!) subfolders. Defaults to <var>false</var>.
  */

includeSubFolders?: boolean): Promise<folders.MailFolder[] | null>;
  /**
 * Get all parent folders as a flat ordered array. The first array entry is the direct parent.
  */
  function getParentFolders(folderId:  folders.MailFolderId, /**
 * Specifies whether each returned parent $(ref:folders.MailFolder) should populate its <var>subFolders</var> property and include all its (nested!) subfolders. Defaults to <var>false</var>.
  */

includeSubFolders?: boolean): Promise<folders.MailFolder[] | null>;
  /**
 * Get the subfolders of the specified folder.
  */
  function getSubFolders(folderId:  folders.MailFolderId, /**
 * Specifies whether each returned direct child $(ref:folders.MailFolder) should populate its <var>subFolders</var> property and include all its (nested!) subfolders. Defaults to <var>false</var>.
  */

includeSubFolders?: boolean): Promise<folders.MailFolder[] | null>;
  /**
 * Get the subfolders of the specified folder or account.
  */
  function getSubFolders(folder:  folders.MailFolderId |  folders.MailFolder |  accounts.MailAccount, /**
 * Specifies whether each returned direct child $(ref:folders.MailFolder) should populate its <var>subFolders</var> property and include all its (nested!) subfolders. Defaults to <var>true</var>.
  */

includeSubFolders?: boolean): Promise<folders.MailFolder[] | null>;
  /**
 * Get one of the special unified mailbox folders, which are virtual search folders and return the content from all mail accounts.
  */
  function getUnifiedFolder(/**
 * The requested unified mailbox folder type.
  */

type: 'inbox'
 | 'drafts'
 | 'sent'
 | 'trash'
 | 'templates'
 | 'archives'
 | 'junk', /**
 * Specifies whether the returned $(ref:folders.MailFolder) should populate its <var>subFolders</var> property and include all its (nested!) subfolders. Defaults to <var>false</var>.
  */

includeSubFolders?: boolean): Promise< folders.MailFolder | null>;
  /**
 * Get one of the special unified mailbox tag folders, which are virtual search folders and group messages from all mail accounts based on their tags.
  */
  function getTagFolder(/**
 * The tag key of the requested folder. See $(ref:messages.tags.list()) for the available tags. Throws when specifying an invalid tag key.
  */

key: string): Promise< folders.MailFolder | null>;
  /**
 * Marks all messages in a folder as read.
  */
  function markAsRead(folder:  folders.MailFolderId |  folders.MailFolder): Promise<void | null>;
  /**
 * Marks all messages in a folder as read.
  */
  function markAsRead(folderId:  folders.MailFolderId): Promise<void | null>;
    const onCreated: EventHandler<  /**
 * Fired when a folder has been created.
  */
  ((createdFolder:  folders.MailFolder) => void)>;
    const onRenamed: EventHandler<  /**
 * Fired when a folder has been renamed.
  */
  ((originalFolder:  folders.MailFolder, renamedFolder:  folders.MailFolder) => void)>;
    const onMoved: EventHandler<  /**
 * Fired when a folder has been moved.
  */
  ((originalFolder:  folders.MailFolder, movedFolder:  folders.MailFolder) => void)>;
    const onCopied: EventHandler<  /**
 * Fired when a folder has been copied.
  */
  ((originalFolder:  folders.MailFolder, copiedFolder:  folders.MailFolder) => void)>;
    const onDeleted: EventHandler<  /**
 * Fired when a folder has been deleted.
  */
  ((deletedFolder:  folders.MailFolder) => void)>;
    const onUpdated: EventHandler<  /**
 * Fired when properties of a folder have changed (<var>specialUse</var> and <var>isFavorite</var>).
  */
  ((originalFolder:  folders.MailFolder, updatedFolder:  folders.MailFolder) => void)>;
    const onFolderInfoChanged: EventHandler<  /**
 * Fired when certain information of a folder have changed. Bursts of message count changes are collapsed to a single event.
  */
  ((folder:  folders.MailFolder, folderInfo:  folders.MailFolderInfo) => void)>;
  /**
 * The number of most recent folders used in Thunderbird's UI. Controled by the <var>mail.folder_widget.max_recent</var> preference.
  */
const DEFAULT_MOST_RECENT_LIMIT = -1;
}

declare namespace browser.addressBooks {
  /**
 * Indicates the type of a Node.
  */
  /**
 * Indicates the type of a Node.
  */
  type NodeType = string;
  /**
 * A node representing an address book.
  */
  export interface AddressBookNode {
  /**
   * The unique identifier for the node. IDs are unique within the current profile, and they remain valid even after the program is restarted.
  */
    id: string
  /**
   * The <var>id</var> of the parent object.
  */
    parentId?: string
  /**
   * Always set to <var>addressBook</var>.
  */
    type: NodeType
  /**
   * Indicates if the object is read-only.
  */
    readOnly?: boolean
  /**
   * Indicates if the address book is accessed via remote look-up.
  */
    remote?: boolean
    name: string
  /**
   * A list of contacts held by this node's address book or mailing list.
  */
    contacts?: contacts.ContactNode[]
  /**
   * A list of mailingLists in this node's address book.
  */
    mailingLists?: mailingLists.MailingListNode[]

  }

  /**
 * Opens the address book user interface.
  */
  function openUI(): Promise< tabs.Tab | null>;
  /**
 * Closes the address book user interface.
  */
  function closeUI(): Promise<any>;
  /**
 * Gets a list of the user's address books, optionally including all contacts and mailing lists.
  */
  function list(/**
 * If set to true, results will include contacts and mailing lists for each address book.
  */

complete?: boolean): Promise<AddressBookNode[] | null>;
  /**
 * Gets a single address book, optionally including all contacts and mailing lists.
  */
  function get(id: string, /**
 * If set to true, results will include contacts and mailing lists for this address book.
  */

complete?: boolean): Promise<AddressBookNode | null>;
  /**
 * Creates a new, empty address book.
  */
  function create(properties: {
      name: string

  }): Promise<string | null>;
  /**
 * Renames an address book.
  */
  function update(id: string, properties: {
      name: string

  }): Promise<any>;
    const onCreated: EventHandler<  /**
 * Fired when an address book is created.
  */
  ((node: AddressBookNode) => void)>;
    const onUpdated: EventHandler<  /**
 * Fired when an address book is renamed.
  */
  ((node: AddressBookNode) => void)>;
    const onDeleted: EventHandler<  /**
 * Fired when an addressBook is deleted.
  */
  ((id: string) => void)>;
}

declare namespace browser.addressBooks.provider {
    const onSearchRequest: EventHandler<  /**
 * Registering this listener will create and list a read-only address book in Thunderbird's address book window, similar to LDAP address books. When selecting this address book, users will first see no contacts, but they can search for them, which will fire this event. Contacts returned by the listener callback will be displayed as contact cards in the address book. Several listeners can be registered, to create multiple address books.

The event also fires for each registered listener (for each created read-only address book), when users type something into the mail composer's *To:* field, or into similar fields like the calendar meeting attendees field. Contacts returned by the listener callback will be added to the autocomplete results in the dropdown of that field.

Example: <literalinclude>includes/addressBooks/onSearchRequest.js<lang>JavaScript</lang></literalinclude>
  */
  ((node: AddressBookNode, /**
 * The search text that the user entered. Not available when invoked from the advanced address book search dialog.
  */

searchString?: string, /**
 * The boolean query expression corresponding to the search. **Note:** This parameter may change in future releases of Thunderbird.
  */

query?: string) => void)>;
}

declare namespace browser.addressBooks.contacts {
}

declare namespace browser.addressBooks.mailingLists {
}

declare namespace browser.contacts {
  /**
 * Object defining a query for $(ref:contacts.quickSearch).
  */
  export interface QueryInfo {
  /**
   * The id of the address book to search. If not specified, all address books are searched.
  */
    parentId?: string
  /**
   * One or more space-separated terms to search for in predefined contact fields (defined by the preference <var>mail.addr_book.quicksearchquery.format</var>).
  */
    searchString?: string
  /**
   * Whether to include results from local address books. Defaults to <var>true</var>.
  */
    includeLocal?: boolean
  /**
   * Whether to include results from remote address books. Defaults to <var>true</var>.
  */
    includeRemote?: boolean
  /**
   * Whether to include results from read-only address books. Defaults to <var>true</var>.
  */
    includeReadOnly?: boolean
  /**
   * Whether to include results from read-write address books. Defaults to <var>true</var>.
  */
    includeReadWrite?: boolean

  }

  /**
 * A node representing a contact in an address book.
  */
  export interface ContactNode {
  /**
   * The unique identifier for the node. IDs are unique within the current profile, and they remain valid even after the program is restarted.
  */
    id: string
  /**
   * The <var>id</var> of the parent object.
  */
    parentId?: string
  /**
   * Always set to <var>contact</var>.
  */
    type:  addressBooks.NodeType
  /**
   * Indicates if the object is read-only.
  */
    readOnly?: boolean
  /**
   * Indicates if the object came from a remote address book.
  */
    remote?: boolean
    properties: ContactProperties
    vCard: string

  }

  /**
 * A set of individual properties for a particular contact, and its vCard string. Further information can be found in $(doc:examples/vcard).
  */
  export interface ContactProperties {
  }

  /**
 * A dictionary of changed properties. Keys are the property name that changed, values are an object containing <var>oldValue</var> and <var>newValue</var>. Values can be either a string or <var>null</var>.
  */
  export interface PropertyChange {
  }

  /**
 * Gets all the contacts in the address book with the id <var>parentId</var>.
  */
  function list(parentId: string): Promise<ContactNode[] | null>;
  /**
 * Gets all contacts matching <var>queryInfo</var> in the address book with the id <var>parentId</var>.
  */
  function quickSearch(/**
 * The id of the address book to search. If not specified, all address books are searched.
  */

parentId: string, /**
 * Either a *string* with one or more space-separated terms to search for, or a complex $(ref:contacts.QueryInfo) search query.
  */

queryInfo: string | QueryInfo): Promise<ContactNode[] | null>;
  function quickSearch(/**
 * Either a *string* with one or more space-separated terms to search for, or a complex $(ref:contacts.QueryInfo) search query.
  */

queryInfo: string | QueryInfo): Promise<ContactNode[] | null>;
  /**
 * Gets all contacts matching <var>queryInfo</var>.
  */
  function query(queryInfo: QueryInfo): Promise<ContactNode[] | null>;
  /**
 * Gets a single contact.
  */
  function get(id: string): Promise<ContactNode | null>;
  /**
 * Gets the photo associated with this contact. Returns <var>null</var>, if no photo is available.
  */
  function getPhoto(id: string): Promise</* "unknown" undefined */ object | void /* could not determine correct type */ | null>;
  /**
 * Sets the photo associated with this contact.
  */
  function setPhoto(id: string, file: /* "unknown" undefined */ object): Promise<any>;
  /**
 * Adds a new contact to the address book with the id <var>parentId</var>.
  */
  function create(parentId: string, /**
 * Assigns the contact an id. If an existing contact has this id, an exception is thrown. **Note:** Deprecated, the card's id should be specified in the vCard string instead.
  */

id: string, /**
 * The properties object for the new contact. If it includes a <var>vCard</var> member, all specified <a href='url-legacy-properties'>legacy properties</a> are ignored and the new contact will be based on the provided vCard string. If a UID is specified in the vCard string, which is already used by another contact, an exception is thrown. **Note:** Using individual properties is deprecated, use the <var>vCard</var> member instead.
  */

properties: ContactProperties): Promise<string | null>;
  function create(parentId: string, /**
 * The properties object for the new contact. If it includes a <var>vCard</var> member, all specified <a href='url-legacy-properties'>legacy properties</a> are ignored and the new contact will be based on the provided vCard string. If a UID is specified in the vCard string, which is already used by another contact, an exception is thrown. **Note:** Using individual properties is deprecated, use the <var>vCard</var> member instead.
  */

properties: ContactProperties): Promise<string | null>;
  /**
 * Adds a new contact to the address book with the id <var>parentId</var>.
  */
  function create(parentId: string, /**
 * The vCard for the new contact. If it includes an (optional) id and an existing contact has this id already, an exception is thrown.
  */

vCard: string): Promise<string | null>;
  /**
 * Updates a contact.
  */
  function update(id: string, /**
 * An object with properties to update the specified contact. Individual properties are removed, if they are set to <var>null</var>. If the provided object includes a <var>vCard</var> member, all specified <a href='url-legacy-properties'>legacy properties</a> are ignored and the details of the contact will be replaced by the provided vCard. Changes to the UID will be ignored. **Note:** Using individual properties is deprecated, use the <var>vCard</var> member instead. 
  */

properties: ContactProperties): Promise<any>;
  /**
 * Updates a contact.
  */
  function update(id: string, /**
 * The updated vCard for the contact.
  */

vCard: string): Promise<any>;
    const onCreated: EventHandler<  /**
 * Fired when a contact is created.
  */
  ((node: ContactNode) => void)>;
    const onUpdated: EventHandler<  /**
 * Fired when a contact is changed.
  */
  ((node: ContactNode, changedProperties: PropertyChange) => void)>;
    const onUpdated: EventHandler<  /**
 * Fired when a contact is changed.
  */
  ((node: ContactNode, oldVCard: string) => void)>;
    const onDeleted: EventHandler<  /**
 * Fired when a contact is removed from an address book.
  */
  ((parentId: string, id: string) => void)>;
}

declare namespace browser.mailingLists {
  /**
 * A node representing a mailing list.
  */
  export interface MailingListNode {
  /**
   * The unique identifier for the node. IDs are unique within the current profile, and they remain valid even after the program is restarted.
  */
    id: string
  /**
   * The <var>id</var> of the parent object.
  */
    parentId?: string
  /**
   * Always set to <var>mailingList</var>.
  */
    type:  addressBooks.NodeType
  /**
   * Indicates if the object is read-only.
  */
    readOnly?: boolean
  /**
   * Indicates if the object came from a remote address book.
  */
    remote?: boolean
    name: string
    nickName: string
    description: string
  /**
   * A list of contacts held by this node's address book or mailing list.
  */
    contacts?: contacts.ContactNode[]

  }

  /**
 * Gets all the mailing lists in the address book with id <var>parentId</var>.
  */
  function list(parentId: string): Promise<MailingListNode[] | null>;
  /**
 * Gets a single mailing list.
  */
  function get(id: string): Promise<MailingListNode | null>;
  /**
 * Creates a new mailing list in the address book with id <var>parentId</var>.
  */
  function create(parentId: string, properties: {
      name: string
    nickName?: string
    description?: string

  }): Promise<string | null>;
  /**
 * Edits the properties of a mailing list.
  */
  function update(id: string, properties: {
      name: string
    nickName?: string
    description?: string

  }): Promise<any>;
  /**
 * Adds a contact to the mailing list with id <var>id</var>. If the contact and mailing list are in different address books, the contact will also be copied to the list's address book.
  */
  function addMember(id: string, contactId: string): Promise<any>;
  /**
 * Gets all contacts that are members of the mailing list with id <var>id</var>.
  */
  function listMembers(id: string): Promise<contacts.ContactNode[] | null>;
  /**
 * Removes a contact from the mailing list with id <var>id</var>. This does not delete the contact from the address book.
  */
  function removeMember(id: string, contactId: string): Promise<any>;
    const onCreated: EventHandler<  /**
 * Fired when a mailing list is created.
  */
  ((node: MailingListNode) => void)>;
    const onUpdated: EventHandler<  /**
 * Fired when a mailing list is changed.
  */
  ((node: MailingListNode) => void)>;
    const onDeleted: EventHandler<  /**
 * Fired when a mailing list is deleted.
  */
  ((parentId: string, id: string) => void)>;
    const onMemberAdded: EventHandler<  /**
 * Fired when a contact is added to the mailing list.
  */
  ((node:  contacts.ContactNode) => void)>;
    const onMemberRemoved: EventHandler<  /**
 * Fired when a contact is removed from the mailing list.
  */
  ((parentId: string, id: string) => void)>;
}

  /**
 * Use the commands API to add keyboard shortcuts that trigger actions in your extension, for example opening one of the action popups or sending a command to the extension.
  */
declare namespace browser.commands {
  export interface Command {
  /**
   * The name of the Extension Command
  */
    name?: string
  /**
   * The Extension Command description
  */
    description?: string
  /**
   * The shortcut active for this command, or blank if not active.
  */
    shortcut?: string

  }

  /**
 * Update the details of an already defined command.
  */
  function update(/**
 * The new details for the command.
  */

detail: {
    /**
   * The name of the command.
  */
    name: string
  /**
   * The description for the command.
  */
    description?: string
  /**
   * An empty string to clear the shortcut, or a string matching the format defined by the <a href='url-commands-shortcuts'>MDN page of the commands API</a>  to set a new shortcut key. If the string does not match this format, the function throws an error.
  */
    shortcut?: string

  }): Promise<any>;
  /**
 * Reset a command's details to what is specified in the manifest.
  */
  function reset(/**
 * The name of the command.
  */

name: string): Promise<any>;
  /**
 * Returns all the registered extension commands for this extension and their shortcut (if active).
  */
  function getAll(): Promise<Command[] | null>;
    const onCommand: EventHandler<  /**
 * Fired when a registered command is activated using a keyboard shortcut. This is a user input event handler. For asynchronous listeners some <a href='url-user-input-restrictions'>restrictions</a> apply.
  */
  ((command: string, /**
 * The details of the active tab while the command occurred.
  */

tab:  tabs.Tab) => void)>;
    const onChanged: EventHandler<  /**
 * Fired when a registered command's shortcut is changed.
  */
  ((changeInfo: {
    /**
   * The name of the shortcut.
  */
    name: string
  /**
   * The new shortcut active for this command, or blank if not active.
  */
    newShortcut: string
  /**
   * The old shortcut which is no longer active for this command, or blank if the shortcut was previously inactive.
  */
    oldShortcut: string

  }) => void)>;
}

declare namespace browser.compose {
  type ComposeRecipient = string | {
    /**
   * The ID of a contact or mailing list from the $(doc:contacts) or $(doc:mailingLists).
  */
    id: string
  /**
   * The ID of a contact or mailing list node from the $(doc:addressBook.contacts) or $(doc:addressBook.mailingLists).
  */
    nodeId: string
  /**
   * Which sort of object this ID is for.
  */
    type: 'contact'
 | 'mailingList'

  };
  type ComposeRecipientList = ComposeRecipient | ComposeRecipient[];
  /**
 * Represent the state of the message composer.
  */
  export interface ComposeState {
  /**
   * The message can be send now.
  */
    canSendNow: boolean
  /**
   * The message can be send later.
  */
    canSendLater: boolean

  }

  /**
 * Used by various functions to represent the state of a message being composed. Note that functions using this type may have a partial implementation.
  */
  export interface ComposeDetails {
  /**
   * An additional fcc folder which can be selected while composing the message. Cleared when set to <var>null</var>. The permission <permission>accountsRead</permission> is required to use this property.
  */
    additionalFccFolderId?:  folders.MailFolderId
  /**
   * An additional fcc folder which can be selected while composing the message, an empty string if not used. The permission <permission>accountsRead</permission> is required to use this property.
  */
    additionalFccFolder?:  folders.MailFolderId |  folders.MailFolder | ''
  /**
   * Whether the public OpenPGP key of the sending identity should be attached to the message.
  */
    attachPublicPGPKey?: boolean
  /**
   * Whether or not the vCard of the used identity will be attached to the message during send. **Note:** If the value has not been modified, selecting a different identity will load the default value of the new identity.
  */
    attachVCard?: boolean
  /**
   * Only used in the begin* functions. Attachments to add to the message.
  */
    attachments?: []
    bcc?: ComposeRecipientList
  /**
   * The HTML content of the message.
  */
    body?: string
    cc?: ComposeRecipientList
  /**
   * Array of custom headers. Headers will be returned in *Http-Header-Case* (a.k.a. *Train-Case*). Set an empty array to clear all custom headers.
  */
    customHeaders?: CustomHeader[]
  /**
   * Defines the MIME format of the sent message (ignored on plain text messages). Defaults to <var>auto</var>, which will send html messages as plain text, if they do not include any formatting, and as <var>both</var> otherwise (a multipart/mixed message).
  */
    deliveryFormat?: 'auto'
 | 'plaintext'
 | 'html'
 | 'both'
  /**
   * Let the sender know when the recipient's server received the message. Not supported by all servers.
  */
    deliveryStatusNotification?: boolean
  /**
   * The selected encryption technology (<var>OpenPGP</var> or <var>S/MIME</var>) which is to be used to sign and/or encrypt the message. If the sending identity does not support encryption at all, this will be <var>undefined</var>.
  */
    selectedEncryptionTechnology?:  compose.EncryptionPropertiesSMIME |  compose.EncryptionPropertiesOpenPGP
    followupTo?: ComposeRecipientList
  /**
   * *Caution*: Setting a value for <var>from</var> does not change the used identity, it overrides the *From* header. Many email servers do not accept emails where the *From* header does not match the sender identity. Must be set to exactly one valid email address.
  */
    from?: ComposeRecipient
  /**
   * The ID of an identity from the $(doc:accounts). The settings from the identity will be used in the composed message. If <var>replyTo</var> is also specified, the <var>replyTo</var> property of the identity is overridden. The permission <permission>accountsRead</permission> is required to include the <var>identityId</var>.
  */
    identityId?: string
  /**
   * Whether the composer is considered modified by the user. A modified composer asks for confirmation, when it is closed.
  */
    isModified?: boolean
  /**
   * Whether the message is an HTML message or a plain text message.
  */
    isPlainText?: boolean
  /**
   * A single newsgroup name or an array of newsgroup names.
  */
    newsgroups?: string | string[]
  /**
   * Indicates whether the default fcc setting (defined by the used identity) is being overridden for this message. Setting <var>false</var> will clear the override. Setting <var>true</var> will throw an *ExtensionError*, if <var>overrideDefaultFccFolder</var> is not set as well. The permission <permission>accountsRead</permission> is required to use this property.
  */
    overrideDefaultFcc?: boolean
  /**
   *  This value overrides the default fcc setting (defined by the used identity) for this message only. Either a $(ref:folders.MailFolder) specifying the folder for the copy of the sent message, or an empty string to not save a copy at all. The permission <permission>accountsRead</permission> is required to use this property.
  */
    overrideDefaultFccFolder?:  folders.MailFolderId |  folders.MailFolder | ''
  /**
   *  This value overrides the default fcc setting (defined by the used identity) for this message only. Either a $(ref:folders.MailFolderId) specifying the folder for the copy of the sent message, or an empty string to not save a copy at all. Reset when set to <var>null</var>. The permission <permission>accountsRead</permission> is required to use this property.
  */
    overrideDefaultFccFolderId?:  folders.MailFolderId
  /**
   * The plain text content of the message.
  */
    plainTextBody?: string
  /**
   * The priority of the message.
  */
    priority?: 'lowest'
 | 'low'
 | 'normal'
 | 'high'
 | 'highest'
  /**
   * The id of the original message (in case of draft, template, forward or reply). Read-only. Is <var>null</var> in all other cases or if the original message was opened from file.
  */
    relatedMessageId?:  messages.MessageId
    replyTo?: ComposeRecipientList
  /**
   * Add the *Disposition-Notification-To* header to the message to requests the recipients email client to send a reply once the message has been received. Recipient server may strip the header and the recipient might ignore the request.
  */
    returnReceipt?: boolean
    subject?: string
    to?: ComposeRecipientList
  /**
   * Read-only. The type of the message being composed, depending on how the compose window was opened by the user.
  */
    type?: 'draft'
 | 'new'
 | 'redirect'
 | 'reply'
 | 'forward'

  }

  /**
 * Object used to add, update or rename an attachment in a message being composed.
  */
  export interface FileAttachment {
  /**
   * The new content for the attachment.
  */
    file?: /* "unknown" undefined */ object
  /**
   * The new name for the attachment, as displayed to the user. If not specified, the name of the provided <var>file</var> object is used.
  */
    name?: string

  }

  /**
 * Represents an attachment in a message being composed.
  */
  export interface ComposeAttachment {
  /**
   * A unique identifier for this attachment.
  */
    id: number
  /**
   * The name of this attachment, as displayed to the user.
  */
    name?: string
  /**
   * The size in bytes of this attachment. Read-only.
  */
    size?: number

  }

  /**
 * A custom header definition.
  */
  export interface CustomHeader {
  /**
   * Name of a custom header, must be prefixed by <var>X-</var> (but not by <var>X-Mozilla-</var>) or be one of the explicitly allowed headers (<var>MSIP_Labels</var>)
  */
    name: string
    value: string

  }

  /**
 * A *dictionary object* with entries for all installed dictionaries, having a language identifier as *key* (for example <var>en-US</var>) and a boolean expression as *value*, indicating whether that dictionary is enabled for spellchecking or not.
  */
  export interface ComposeDictionaries {
  }

  export interface EncryptionPropertiesOpenPGP {
    name: string
  /**
   * Whether encryption of the message body using the OpenPGP technology is enabled. **Note:** If encryption is enabled, but the <a href='url-help-cannot-encrypt'>preconditions</a> for sending an encrypted message are not met, the message cannot be sent.
  */
    encryptBody: boolean
  /**
   * Whether encryption of the message subject using the OpenPGP technology is enabled (only supported if encryption of the body is enabled a well).
  */
    encryptSubject: boolean
  /**
   * Whether the message will be signed using the OpenPGP technology.
  */
    signMessage: boolean

  }

  export interface EncryptionPropertiesSMIME {
    name: string
  /**
   * Whether encryption of the message body using the S/MIME technology is enabled. **Note:** If encryption is enabled, but the <a href='url-help-cannot-encrypt'>preconditions</a> for sending an encrypted message are not met, the message cannot be sent.
  */
    encryptBody: boolean
  /**
   * Whether the message will be signed using the S/MIME technology
  */
    signMessage: boolean

  }

  /**
 * Open a new message compose window.

**Note:** The compose format can be set by <var>details.isPlainText</var> or by specifying only one of <var>details.body</var> or <var>details.plainTextBody</var>. Otherwise the default compose format of the selected identity is used.

**Note:** Specifying <var>details.body</var> and <var>details.plainTextBody</var> without also specifying <var>details.isPlainText</var> threw an exception in Thunderbird up to version 97. Since Thunderbird 98, this combination creates a compose window with the compose format of the selected identity, using the matching <var>details.body</var> or <var>details.plainTextBody</var> value.

**Note:** If no identity is specified, this function is using the default identity and not the identity of the referenced message.
  */
  function beginNew(/**
 * If specified, the message or template to edit as a new message.
  */

messageId?:  messages.MessageId, details?: ComposeDetails): Promise< tabs.Tab | null>;
  /**
 * Open a new message compose window replying to a given message.

**Note:** The compose format can be set by <var>details.isPlainText</var> or by specifying only one of <var>details.body</var> or <var>details.plainTextBody</var>. Otherwise the default compose format of the selected identity is used.

**Note:** Specifying <var>details.body</var> and <var>details.plainTextBody</var> without also specifying <var>details.isPlainText</var> threw an exception in Thunderbird up to version 97. Since Thunderbird 98, this combination creates a compose window with the compose format of the selected identity, using the matching <var>details.body</var> or <var>details.plainTextBody</var> value.

**Note:** If no identity is specified, this function is using the default identity and not the identity of the referenced message.
  */
  function beginReply(/**
 * The message to reply to, as retrieved using other APIs.
  */

messageId:  messages.MessageId, replyType?: 'replyToSender'
 | 'replyToList'
 | 'replyToAll', details?: ComposeDetails): Promise< tabs.Tab | null>;
  /**
 * Open a new message compose window forwarding a given message.

**Note:** The compose format can be set by <var>details.isPlainText</var> or by specifying only one of <var>details.body</var> or <var>details.plainTextBody</var>. Otherwise the default compose format of the selected identity is used.

**Note:** Specifying <var>details.body</var> and <var>details.plainTextBody</var> without also specifying <var>details.isPlainText</var> threw an exception in Thunderbird up to version 97. Since Thunderbird 98, this combination creates a compose window with the compose format of the selected identity, using the matching <var>details.body</var> or <var>details.plainTextBody</var> value.

**Note:** If no identity is specified, this function is using the default identity and not the identity of the referenced message.
  */
  function beginForward(/**
 * The message to forward, as retrieved using other APIs.
  */

messageId:  messages.MessageId, forwardType?: 'forwardInline'
 | 'forwardAsAttachment', details?: ComposeDetails): Promise< tabs.Tab | null>;
  /**
 * Fetches the current state of a compose window. Currently only a limited amount of information is available, more will be added in later versions.
  */
  function getComposeDetails(tabId: number): Promise<ComposeDetails | null>;
  /**
 * Updates the compose window. The properties of the given $(ref:compose.ComposeDetails) object will be used to overwrite the current values of the specified compose window, so only properties that are to be changed should be included. Modified settings will be treated as user initiated, and turn off further automatic changes on these settings.

When updating any of the array properties (<var>customHeaders</var> and most address fields), make sure to first get the current values to not accidentally remove all existing entries when setting the new value.

**Note:** The compose format of an existing compose window cannot be changed. Since Thunderbird 98, setting conflicting values for <var>details.body</var>, <var>details.plainTextBody</var> or <var>details.isPlaintext</var> no longer throws an exception, instead the compose window chooses the matching <var>details.body</var> or <var>details.plainTextBody</var> value and ignores the other.
  */
  function setComposeDetails(tabId: number, details: ComposeDetails): Promise<any>;
  /**
 * Returns a $(ref:compose.ComposeDictionaries) object, listing all installed dictionaries, including the information whether they are currently enabled or not.
  */
  function getActiveDictionaries(tabId: number): Promise<ComposeDictionaries | null>;
  /**
 * Updates the active dictionaries. Throws if the <var>activeDictionaries</var> array contains unknown or invalid language identifiers.
  */
  function setActiveDictionaries(tabId: number, activeDictionaries: string[]): Promise<any>;
  /**
 * Lists all of the attachments of the message being composed in the specified tab.
  */
  function listAttachments(tabId: number): Promise<ComposeAttachment[] | null>;
  /**
 * Gets the content of a $(ref:compose.ComposeAttachment) as a <a href='url-dom-file'>File</a> object.
  */
  function getAttachmentFile(/**
 * The unique identifier for the attachment.
  */

id: number): Promise</* "unknown" undefined */ object | null>;
  /**
 * Adds an attachment to the message being composed in the specified tab.
  */
  function addAttachment(tabId: number, attachment: FileAttachment | ComposeAttachment): Promise<ComposeAttachment | null>;
  /**
 * Updates the name and/or the content of an attachment in the message being composed in the specified tab. If the specified attachment is a cloud file attachment and the associated provider failed to update the attachment, the function will throw an *ExtensionError*.
  */
  function updateAttachment(tabId: number, attachmentId: number, attachment: FileAttachment): Promise<ComposeAttachment | null>;
  /**
 * Removes an attachment from the message being composed in the specified tab.
  */
  function removeAttachment(tabId: number, attachmentId: number): Promise<any>;
  /**
 * Sends the message currently being composed. If the send mode is not specified or set to <var>default</var>, the message will be send directly if the user is online and placed in the users outbox otherwise. The returned Promise fulfills once the message has been successfully sent or placed in the user's outbox. Throws when the send process has been aborted by the user, by an $(ref:compose.onBeforeSend) event or if there has been an error while sending the message to the outgoing mail server.
  */
  function sendMessage(tabId: number, options?: {
      mode: 'default'
 | 'sendNow'
 | 'sendLater'

  }): Promise<{
    /**
   * The used send mode.
  */
    mode: 'sendNow'
 | 'sendLater'
  /**
   * The header messageId of the outgoing message. Only included for actually sent messages.
  */
    headerMessageId?: string
  /**
   * Copies of the sent message. The number of created copies depends on the applied file carbon copy configuration (fcc).
  */
    messages: messages.MessageHeader[]

  } | null>;
  /**
 * Saves the message currently being composed as a draft or as a template. If the save mode is not specified, the message will be saved as a draft. The returned Promise fulfills once the message has been successfully saved.
  */
  function saveMessage(tabId: number, options?: {
      mode: 'draft'
 | 'template'

  }): Promise<{
    /**
   * The used save mode.
  */
    mode: 'draft'
 | 'template'
  /**
   * The saved message(s). The number of saved messages depends on the applied file carbon copy configuration (fcc).
  */
    messages: messages.MessageHeader[]

  } | null>;
  /**
 * Returns information about the current state of the message composer.
  */
  function getComposeState(tabId: number): Promise<ComposeState | null>;
    const onBeforeSend: EventHandler<  /**
 * Fired when a message is about to be sent from the compose window. This is a user input event handler. For asynchronous listeners some <a href='url-user-input-restrictions'>restrictions</a> apply.
  */
  ((tab:  tabs.Tab, /**
 * The current state of the compose window. This is functionally the same as calling the $(ref:compose.getComposeDetails) function.
  */

details: ComposeDetails) => object)>;
    const onAfterSend: EventHandler<  /**
 * Fired when sending a message succeeded or failed.
  */
  ((tab:  tabs.Tab, sendInfo: {
    /**
   * The used send mode.
  */
    mode: 'sendNow'
 | 'sendLater'
  /**
   * An error description, if sending the message failed.
  */
    error?: string
  /**
   * The header messageId of the outgoing message. Only included for actually sent messages.
  */
    headerMessageId?: string
  /**
   * Copies of the sent message. The number of created copies depends on the applied file carbon copy configuration (fcc).
  */
    messages: messages.MessageHeader[]

  }) => void)>;
    const onAfterSave: EventHandler<  /**
 * Fired when saving a message as draft or template succeeded or failed.
  */
  ((tab:  tabs.Tab, saveInfo: {
    /**
   * The used save mode.
  */
    mode: 'autoSave'
 | 'draft'
 | 'template'
  /**
   * An error description, if saving the message failed.
  */
    error?: string
  /**
   * The saved message(s). The number of saved messages depends on the applied file carbon copy configuration (fcc).
  */
    messages: messages.MessageHeader[]

  }) => void)>;
    const onAttachmentAdded: EventHandler<  /**
 * Fired when an attachment is added to a message being composed.
  */
  ((tab:  tabs.Tab, attachment: ComposeAttachment) => void)>;
    const onAttachmentRemoved: EventHandler<  /**
 * Fired when an attachment is removed from a message being composed.
  */
  ((tab:  tabs.Tab, attachmentId: number) => void)>;
    const onIdentityChanged: EventHandler<  /**
 * Fired when the user changes the identity that will be used to send a message being composed.
  */
  ((tab:  tabs.Tab, identityId: string) => void)>;
    const onComposeStateChanged: EventHandler<  /**
 * Fired when the state of the message composer changed.
  */
  ((tab:  tabs.Tab, state: ComposeState) => void)>;
    const onActiveDictionariesChanged: EventHandler<  /**
 * Fired when one or more dictionaries have been activated or deactivated.
  */
  ((tab:  tabs.Tab, dictionaries: ComposeDictionaries) => void)>;
}

  /**
 * The windows API supports creating, modifying and interacting with Thunderbird windows.
  */
declare namespace browser.windows {
  /**
 * The type of a window. Under some circumstances a window may not be assigned a type property.
  */
  /**
 * The type of a window. Under some circumstances a window may not be assigned a type property.
  */
  type WindowType = string;
  /**
 * The state of this window.
  */
  /**
 * The state of this window.
  */
  type WindowState = string;
  export interface Window {
  /**
   * The ID of the window. Window IDs are unique within a session.
  */
    id?: number
  /**
   * Whether the window is currently the focused window.
  */
    focused: boolean
  /**
   * The offset of the window from the top edge of the screen in pixels.
  */
    top?: number
  /**
   * The offset of the window from the left edge of the screen in pixels.
  */
    left?: number
  /**
   * The width of the window, including the frame, in pixels.
  */
    width?: number
  /**
   * The height of the window, including the frame, in pixels.
  */
    height?: number
  /**
   * Array of $(ref:tabs.Tab) objects representing the current tabs in the window. Only included if requested by $(ref:windows.get), $(ref:windows.getCurrent), $(ref:windows.getAll) or $(ref:windows.getLastFocused), and the optional $(ref:windows.GetInfo) parameter has its <var>populate</var> member set to <var>true</var>.
  */
    tabs?: tabs.Tab[]
  /**
   * Whether the window is incognito. Since Thunderbird does not support the incognito mode, this is always <var>false</var>.
  */
    incognito: boolean
  /**
   * The type of window this is.
  */
    type?: WindowType
  /**
   * The state of this window.
  */
    state?: WindowState
  /**
   * Whether the window is set to be always on top.
  */
    alwaysOnTop: boolean
  /**
   * The title of the window. Read-only.
  */
    title?: string

  }

  /**
 * Specifies what type of window to create. Thunderbird does not support <var>panel</var> and <var>detached_panel</var>, they are interpreted as <var>popup</var>.
  */
  /**
 * Specifies what type of window to create. Thunderbird does not support <var>panel</var> and <var>detached_panel</var>, they are interpreted as <var>popup</var>.
  */
  type CreateType = string;
  /**
 * Specifies additional requirements for the returned windows.
  */
  export interface GetInfo {
  /**
   * If true, the $(ref:windows.Window) returned will have a <var>tabs</var> property that contains an array of $(ref:tabs.Tab) objects representing the tabs inside the window. The $(ref:tabs.Tab) objects only contain the <var>url</var>, <var>title</var> and <var>favIconUrl</var> properties if the extension's manifest file includes the <permission>tabs</permission> permission.
  */
    populate?: boolean
  /**
   * If set, the $(ref:windows.Window) returned will be filtered based on its type. Supported by $(ref:windows.getAll) only, ignored in all other functions.
  */
    windowTypes?: WindowType[]

  }

  /**
 * Gets details about a window.
  */
  function get(windowId: number, getInfo?: GetInfo): Promise<Window | null>;
  /**
 * Gets the active or topmost window.
  */
  function getCurrent(getInfo?: GetInfo): Promise<Window | null>;
  /**
 * Gets the window that was most recently focused &mdash; typically the window 'on top'.
  */
  function getLastFocused(getInfo?: GetInfo): Promise<Window | null>;
  /**
 * Gets all windows.
  */
  function getAll(getInfo?: GetInfo): Promise<Window[] | null>;
  /**
 * Creates (opens) a new window with any optional sizing, position or default URL provided. When loading a page into a popup window, same-site links are opened within the same window, all other links are opened in the user's default browser. To override this behavior, add-ons have to register a <a href='url-content-script-click-capture'>content script</a> , capture click events and handle them manually. Same-site links with targets other than <var>_self</var> are opened in a new tab in the most recent <var>normal</var> Thunderbird window.
  */
  function create(createData?: {
    /**
   * A URL to be opened in a popup window, ignored in all other window types. This may also be an array, but only the first element is used (popup windows may not have multiple tabs). If the URL points to a content page (a web page, an extension page or a registered WebExtension protocol handler page), the popup window will navigate to the requested page. All other URLs will be opened externally after creating an empty popup window. Fully-qualified URLs must include a scheme (i.e. <var>http://www.google.com</var>, not <var>www.google.com</var>). Relative URLs will be relative to the root of the extension. Defaults to the New Tab Page.
  */
    url?: string | string[]
  /**
   * The id of the tab for which you want to adopt to the new window.
  */
    tabId?: number
  /**
   * The number of pixels to position the new window from the left edge of the screen. If not specified, the new window is offset naturally from the last focused window.
  */
    left?: number
  /**
   * The number of pixels to position the new window from the top edge of the screen. If not specified, the new window is offset naturally from the last focused window.
  */
    top?: number
  /**
   * The width in pixels of the new window, including the frame. If not specified defaults to a natural width.
  */
    width?: number
  /**
   * The height in pixels of the new window, including the frame. If not specified defaults to a natural height.
  */
    height?: number
  /**
   * Specifies what type of window to create. Thunderbird does not support <var>panel</var> and <var>detached_panel</var>, they are interpreted as <var>popup</var>.
  */
    type?: CreateType
  /**
   * The initial state of the window. The <var>minimized</var>, <var>maximized</var> and <var>fullscreen</var> states cannot be combined with <var>left</var>, <var>top</var>, <var>width</var> or <var>height</var>.
  */
    state?: WindowState
  /**
   * Allow scripts running inside the window to close the window by calling `window.close()`.
  */
    allowScriptsToClose?: boolean
  /**
   * The CookieStoreId to use for all tabs that were created when the window is opened.
  */
    cookieStoreId?: string
  /**
   * A string to add to the beginning of the window title.
  */
    titlePreface?: string

  }): Promise<Window | null>;
  /**
 * Updates the properties of a window. Specify only the properties that you want to change; unspecified properties will be left unchanged.
  */
  function update(windowId: number, updateInfo: {
    /**
   * The offset from the left edge of the screen to move the window to in pixels. This value is ignored for panels.
  */
    left?: number
  /**
   * The offset from the top edge of the screen to move the window to in pixels. This value is ignored for panels.
  */
    top?: number
  /**
   * The width to resize the window to in pixels.
  */
    width?: number
  /**
   * The height to resize the window to in pixels.
  */
    height?: number
  /**
   * If true, brings the window to the front. If false, brings the next window in the z-order to the front.
  */
    focused?: boolean
  /**
   * Setting this to <var>true</var> will cause the window to be displayed in a manner that draws the user's attention to the window, without changing the focused window. The effect lasts until the user changes focus to the window. This option has no effect if the window already has focus.
  */
    drawAttention?: boolean
  /**
   * The new state of the window. The <var>minimized</var>, <var>maximized</var> and <var>fullscreen</var> states cannot be combined with <var>left</var>, <var>top</var>, <var>width</var> or <var>height</var>.
  */
    state?: WindowState
  /**
   * A string to add to the beginning of the window title.
  */
    titlePreface?: string

  }): Promise<Window | null>;
  /**
 * Removes (closes) a window, and all the tabs inside it.
  */
  function remove(windowId: number): Promise<void | null>;
  /**
 * Opens the provided URL in the default system browser.
  */
  function openDefaultBrowser(url: string): Promise<any>;
    const onCreated: EventHandler<  /**
 * Fired when a window is created.
  */
  ((/**
 * Details of the window that was created.
  */

window: Window) => void)>;
    const onRemoved: EventHandler<  /**
 * Fired when a window is removed (closed).
  */
  ((/**
 * ID of the removed window.
  */

windowId: number) => void)>;
    const onFocusChanged: EventHandler<  /**
 * Fired when the currently focused window changes. Will be $(ref:windows.WINDOW_ID_NONE), if all windows have lost focus. **Note:** On some Linux window managers, WINDOW_ID_NONE will always be sent immediately preceding a switch from one window to another.
  */
  ((/**
 * ID of the newly focused window.
  */

windowId: number) => void)>;
  /**
 * The windowId value that represents the absence of a window.
  */
const WINDOW_ID_NONE = -1;
  /**
 * The windowId value that represents the current window.
  */
const WINDOW_ID_CURRENT = -2;
}

  /**
 * The tabs API supports creating, modifying and interacting with tabs in Thunderbird windows.
  */
declare namespace browser.tabs {
  export interface Tab {
  /**
   * The ID of the tab. Tab IDs are unique within a session. Under some circumstances a Tab may not be assigned an ID. Tab ID can also be set to $(ref:tabs.TAB_ID_NONE) for apps and devtools windows.
  */
    id?: number
  /**
   * The zero-based index of the tab within its window.
  */
    index: number
  /**
   * The ID of the window the tab is contained within.
  */
    windowId?: number
  /**
   * Whether the tab is highlighted. Works as an alias of active
  */
    highlighted: boolean
  /**
   * Whether the tab is active in its window. (Does not necessarily mean the window is focused.)
  */
    active: boolean
  /**
   * The URL the tab is displaying. This property is only present if the extension's manifest includes the <permission>tabs</permission> permission.
  */
    url?: string
  /**
   * The title of the tab. This property is only present if the extension's manifest includes the <permission>tabs</permission> permission.
  */
    title?: string
  /**
   * The URL of the tab's favicon. This property is only present if the extension's manifest includes the <permission>tabs</permission> permission. It may also be an empty string if the tab is loading.
  */
    favIconUrl?: string
  /**
   * Either <var>loading</var> or <var>complete</var>.
  */
    status?: string
  /**
   * The width of the tab in pixels.
  */
    width?: number
  /**
   * The height of the tab in pixels.
  */
    height?: number
  /**
   * The <a href='url-cookieStore'>CookieStore</a> id used by the tab. Either a custom id created using the <a href='url-contextualIdentity'>contextualIdentities API</a>, or a built-in one: <var>firefox-default</var>, <var>firefox-container-1</var>, <var>firefox-container-2</var>, <var>firefox-container-3</var>, <var>firefox-container-4</var>, <var>firefox-container-5</var>. **Note:** The naming pattern was deliberately not changed for Thunderbird, but kept for compatibility reasons.
  */
    cookieStoreId?: string
    type?: TabType
  /**
   * Whether the tab is a 3-pane tab.
  */
    mailTab?: boolean
  /**
   * The id of the space.
  */
    spaceId?: number

  }

  /**
 * Whether the tabs have completed loading.
  */
  /**
 * Whether the tabs have completed loading.
  */
  type TabStatus = string;
  /**
 * Tab types supported by the tabs API.
  */
  /**
 * Tab types supported by the tabs API.
  */
  type TabType = string;
  /**
 * The type of a window. Under some circumstances a Window may not be assigned a type property.
  */
  /**
 * The type of a window. Under some circumstances a Window may not be assigned a type property.
  */
  type WindowType = string;
  /**
 * Event names supported in onUpdated.
  */
  /**
 * Event names supported in onUpdated.
  */
  type UpdatePropertyName = string;
  /**
 * An object describing filters to apply to tabs.onUpdated events.
  */
  export interface UpdateFilter {
  /**
   * A list of URLs or URL patterns. Events that cannot match any of the URLs will be filtered out. Filtering with urls requires the <permission>tabs</permission> or <permission>activeTab</permission> permission.
  */
    urls?: string[]
  /**
   * A list of property names. Events that do not match any of the names will be filtered out.
  */
    properties?: UpdatePropertyName[]
    tabId?: number
    windowId?: number

  }

  /**
 * Retrieves details about the specified tab.
  */
  function get(tabId: number): Promise<Tab | null>;
  /**
 * Gets the tab that this script call is being made from. May be <var>undefined</var> if called from a non-tab context (for example: a background page or popup view).
  */
  function getCurrent(): Promise<Tab | null>;
  /**
 * Connects to the content script(s) in the specified tab. The <a href='url-runtime-on-connect'>runtime.onConnect</a> event is fired in each content script running in the specified tab for the current extension. For more details, see <a href='url-content-scripts'>Content Script Messaging</a>.
  */
  function connect(tabId: number, connectInfo?: {
    /**
   * Will be passed into onConnect for content scripts that are listening for the connection event.
  */
    name?: string
  /**
   * Open a port to a specific frame identified by <var>frameId</var> instead of all frames in the tab.
  */
    frameId?: number

  }): undefined;
  /**
 * Sends a single message to the content script(s) in the specified tab, with an optional callback to run when a response is sent back. The <a href='url-runtime-on-message'>runtime.onMessage</a> event is fired in each content script running in the specified tab for the current extension.
  */
  function sendMessage(tabId: number, message: any, options?: {
    /**
   * Send a message to a specific frame identified by <var>frameId</var> instead of all frames in the tab.
  */
    frameId?: number

  }): Promise<any>;
  /**
 * Creates a new content tab. Use the $(doc:messageDisplay) to open messages. Only supported in <var>normal</var> windows. Same-site links in the loaded page are opened within Thunderbird, all other links are opened in the user's default browser. To override this behavior, add-ons have to register a <a href='url-content-script-click-capture'>content script</a> , capture click events and handle them manually.
  */
  function create(/**
 * Properties for the new tab. Defaults to an empty tab, if no <var>url</var> is provided.
  */

createProperties: {
    /**
   * The window to create the new tab in. Defaults to the current window.
  */
    windowId?: number
  /**
   * The position the tab should take in the window. The provided value will be clamped to between zero and the number of tabs in the window.
  */
    index?: number
  /**
   * The URL to navigate the tab to initially. If the URL points to a content page (a web page, an extension page or a registered WebExtension protocol handler page), the tab will navigate to the requested page. All other URLs will be opened externally after creating an empty tab. Fully-qualified URLs must include a scheme (i.e. <var>http://www.google.com</var>, not <var>www.google.com</var>). Relative URLs will be relative to the root of the extension. 
  */
    url?: string
  /**
   * Whether the tab should become the active tab in the window. Does not affect whether the window is focused (see $(ref:windows.update)). Defaults to <var>true</var>.
  */
    active?: boolean
  /**
   * The <a href='url-cookieStore'>CookieStore</a> id the new tab should use. Either a custom id created using the <a href='url-contextualIdentity'>contextualIdentities API</a>, or a built-in one: <var>firefox-default</var>, <var>firefox-container-1</var>, <var>firefox-container-2</var>, <var>firefox-container-3</var>, <var>firefox-container-4</var>, <var>firefox-container-5</var>. **Note:** The naming pattern was deliberately not changed for Thunderbird, but kept for compatibility reasons.
  */
    cookieStoreId?: string

  }): Promise<Tab | null>;
  /**
 * Duplicates a tab.
  */
  function duplicate(/**
 * The ID of the tab which is to be duplicated.
  */

tabId: number): Promise<Tab | null>;
  /**
 * Gets all tabs that have the specified properties, or all tabs if no properties are specified.
  */
  function query(queryInfo?: {
    /**
   * Whether the tab is a Thunderbird 3-pane tab.  If specified, the <var>queryInfo.type</var> property will be ignored
  */
    mailTab?: boolean
  /**
   * The id of the space the tabs should belong to.
  */
    spaceId?: number
  /**
   * Match tabs against the given tab type or types.
  */
    type?: TabType | TabType[]
  /**
   * Whether the tabs are active in their windows.
  */
    active?: boolean
  /**
   * Whether the tabs are highlighted. Works as an alias of active.
  */
    highlighted?: boolean
  /**
   * Whether the tabs are in the current window.
  */
    currentWindow?: boolean
  /**
   * Whether the tabs are in the last focused window.
  */
    lastFocusedWindow?: boolean
  /**
   * Whether the tabs have completed loading.
  */
    status?: TabStatus
  /**
   * Match page titles against a pattern.
  */
    title?: string
  /**
   * Match tabs against one or more <a href='url-match-patterns'>URL Patterns</a>. Note that fragment identifiers are not matched.
  */
    url?: string | string[]
  /**
   * The ID of the parent window, or $(ref:windows.WINDOW_ID_CURRENT) for the current window.
  */
    windowId?: number
  /**
   * The type of window the tabs are in.
  */
    windowType?: WindowType
  /**
   * The position of the tabs within their windows.
  */
    index?: number
  /**
   * The <a href='url-cookieStore'>CookieStore</a> id(s) used by the tabs. Either custom ids created using the <a href='url-contextualIdentity'>contextualIdentities API</a>, or built-in ones: <var>firefox-default</var>, <var>firefox-container-1</var>, <var>firefox-container-2</var>, <var>firefox-container-3</var>, <var>firefox-container-4</var>, <var>firefox-container-5</var>. **Note:** The naming pattern was deliberately not changed for Thunderbird, but kept for compatibility reasons.
  */
    cookieStoreId?: string[] | string

  }): Promise<Tab[] | null>;
  /**
 * Modifies the properties of a tab. Properties that are not specified in <var>updateProperties</var> are not modified.
  */
  function update(/**
 * Defaults to the selected tab of the current window.
  */

tabId: number, /**
 * Properties which should to be updated.
  */

updateProperties: {
    /**
   * A URL of a page to load. If the URL points to a content page (a web page, an extension page or a registered WebExtension protocol handler page), the tab will navigate to the requested page. All other URLs will be opened externally without changing the tab. **Note:** This function will throw an error, if a content page is loaded into a non-content tab (its type must be either <var>content</var> or <var>mail</var>).
  */
    url?: string
  /**
   * Set this to <var>true</var>, if the tab should become active. Does not affect whether the window is focused (see $(ref:windows.update)). Setting this to <var>false</var> has no effect.
  */
    active?: boolean

  }): Promise<Tab | null>;
  function update(/**
 * Properties which should to be updated.
  */

updateProperties: {
    /**
   * A URL of a page to load. If the URL points to a content page (a web page, an extension page or a registered WebExtension protocol handler page), the tab will navigate to the requested page. All other URLs will be opened externally without changing the tab. **Note:** This function will throw an error, if a content page is loaded into a non-content tab (its type must be either <var>content</var> or <var>mail</var>).
  */
    url?: string
  /**
   * Set this to <var>true</var>, if the tab should become active. Does not affect whether the window is focused (see $(ref:windows.update)). Setting this to <var>false</var> has no effect.
  */
    active?: boolean

  }): Promise<Tab | null>;
  /**
 * Moves one or more tabs to a new position within its current window, or to a different window. Note that tabs can only be moved to and from windows of type <var>normal</var>.
  */
  function move(/**
 * The tab or list of tabs to move.
  */

tabIds: number | number[], moveProperties: {
    /**
   * Defaults to the window the tab is currently in.
  */
    windowId?: number
  /**
   * The position to move the tab to. <var>-1</var> will place the tab at the end of the window.
  */
    index: number

  }): Promise<Tab[] | null>;
  /**
 * Reload a tab. Only applicable for tabs which display a content page.
  */
  function reload(/**
 * The ID of the tab to reload; defaults to the selected tab of the current window.
  */

tabId?: number, reloadProperties?: {
    /**
   * Whether using any local cache. Default is false.
  */
    bypassCache?: boolean

  }): Promise<void | null>;
  /**
 * Closes one or more tabs.
  */
  function remove(/**
 * The tab or list of tabs to close.
  */

tabIds: number | number[]): Promise<void | null>;
  /**
 * Injects JavaScript code into a page. For details, see the <a href='url-content-scripts'>programmatic injection</a> section of the content scripts doc.
  */
  function executeScript(/**
 * The ID of the tab in which to run the script; defaults to the active tab of the current window.
  */

tabId: number, /**
 * Details of the script to run.
  */

details:  extensionTypes.InjectDetails): Promise<any[] | null>;
  function executeScript(/**
 * Details of the script to run.
  */

details:  extensionTypes.InjectDetails): Promise<any[] | null>;
  /**
 * Injects CSS into a page. For details, see the <a href='url-content-scripts'>programmatic injection</a> section of the content scripts doc.
  */
  function insertCSS(/**
 * The ID of the tab in which to insert the CSS; defaults to the active tab of the current window.
  */

tabId: number, /**
 * Details of the CSS text to insert.
  */

details:  extensionTypes.InjectDetails): Promise<void | null>;
  function insertCSS(/**
 * Details of the CSS text to insert.
  */

details:  extensionTypes.InjectDetails): Promise<void | null>;
  /**
 * Removes injected CSS from a page. For details, see the <a href='url-content-scripts'>programmatic injection</a> section of the content scripts doc.
  */
  function removeCSS(/**
 * The ID of the tab from which to remove the injected CSS; defaults to the active tab of the current window.
  */

tabId: number, /**
 * Details of the CSS text to remove.
  */

details:  extensionTypes.InjectDetails): Promise<void | null>;
  function removeCSS(/**
 * Details of the CSS text to remove.
  */

details:  extensionTypes.InjectDetails): Promise<void | null>;
    const onCreated: EventHandler<  /**
 * Fired when a tab is created. Note that the tab's URL may not be set at the time this event fired, but you can listen to onUpdated events to be notified when a URL is set.
  */
  ((/**
 * Details of the tab that was created.
  */

tab: Tab) => void)>;
    const onUpdated: EventHandler<  /**
 * Fired when a tab is updated.
  */
  ((tabId: number, /**
 * Lists the changes to the state of the tab that was updated.
  */

changeInfo: {
    /**
   * The status of the tab. Can be either <var>loading</var> or <var>complete</var>.
  */
    status?: string
  /**
   * The tab's URL if it has changed.
  */
    url?: string
  /**
   * The tab's new favicon URL.
  */
    favIconUrl?: string

  }, /**
 * Gives the state of the tab that was updated.
  */

tab: Tab) => void)>;
    const onMoved: EventHandler<  /**
 * Fired when a tab is moved within a window. Only one move event is fired, representing the tab the user directly moved. Move events are not fired for the other tabs that must move in response. This event is not fired when a tab is moved between windows. For that, see $(ref:tabs.onDetached).
  */
  ((tabId: number, moveInfo: {
      windowId: number
    fromIndex: number
    toIndex: number

  }) => void)>;
    const onActivated: EventHandler<  /**
 * Fires when the active tab in a window changes. Note that the tab's URL may not be set at the time this event fired, but you can listen to onUpdated events to be notified when a URL is set.
  */
  ((activeInfo: {
    /**
   * The ID of the tab that has become active.
  */
    tabId: number
  /**
   * The ID of the tab that was previously active, if that tab is still open.
  */
    previousTabId?: number
  /**
   * The ID of the window the active tab changed inside of.
  */
    windowId: number

  }) => void)>;
    const onDetached: EventHandler<  /**
 * Fired when a tab is detached from a window, for example because it is being moved between windows.
  */
  ((tabId: number, detachInfo: {
      oldWindowId: number
    oldPosition: number

  }) => void)>;
    const onAttached: EventHandler<  /**
 * Fired when a tab is attached to a window, for example because it was moved between windows.
  */
  ((tabId: number, attachInfo: {
      newWindowId: number
    newPosition: number

  }) => void)>;
    const onRemoved: EventHandler<  /**
 * Fired when a tab is closed.
  */
  ((tabId: number, removeInfo: {
    /**
   * The window whose tab is closed.
  */
    windowId: number
  /**
   * Is <var>true</var> when the tab is being closed because its window is being closed.
  */
    isWindowClosing: boolean

  }) => void)>;
  /**
 * An ID which represents the absence of a tab.
  */
const TAB_ID_NONE = -1;
}

declare namespace browser.menus {
  /**
 * The different contexts a menu can appear in. Specifying <var>all</var> is equivalent to the combination of all other contexts excluding <var>tab</var> and <var>tools_menu</var>. More information about each context can be found in the <a href='url-ui-elements'>Supported UI Elements</a> article on developer.thunderbird.net.
  */
  type ContextType = 'all'
 | 'all_message_attachments'
 | 'audio'
 | 'compose_action'
 | 'compose_action_menu'
 | 'compose_attachments'
 | 'compose_body'
 | 'editable'
 | 'folder_pane'
 | 'frame'
 | 'image'
 | 'link'
 | 'message_attachments'
 | 'message_display_action'
 | 'message_display_action_menu'
 | 'message_list'
 | 'page'
 | 'password'
 | 'selection'
 | 'tab'
 | 'tools_menu'
 | 'video' | 'browser_action'
 | 'browser_action_menu' | 'action'
 | 'action_menu';
  /**
 * The type of menu item.
  */
  /**
 * The type of menu item.
  */
  type ItemType = string;
  /**
 * Information sent when a context menu is being shown. Some properties are only included if the extension has host permission for the given context, for example <permission>activeTab</permission> for content tabs, <permission>compose</permission> for compose tabs and <permission>messagesRead</permission> for message display tabs.
  */
  export interface OnShowData {
  /**
   * A list of IDs of the menu items that were shown.
  */
    menuIds: []
  /**
   * A list of all contexts that apply to the menu.
  */
    contexts: ContextType[]
  /**
   * A flag indicating whether the element is editable (text input, textarea, etc.).
  */
    editable: boolean
  /**
   * One of <var>image</var>, <var>video</var>, or <var>audio</var> if the context menu was activated on one of these types of elements.
  */
    mediaType?: string
  /**
   * The type of view where the menu is shown. May be unset if the menu is not associated with a view.
  */
    viewType?:  extension.ViewType
  /**
   * If the element is a link, the text of that link. **Note:** Host permission is required.
  */
    linkText?: string
  /**
   * If the element is a link, the URL it points to. **Note:** Host permission is required.
  */
    linkUrl?: string
  /**
   * Will be present for elements with a *src* URL. **Note:** Host permission is required.
  */
    srcUrl?: string
  /**
   * The URL of the page where the menu item was clicked. This property is not set if the click occurred in a context where there is no current page, such as in a launcher context menu. **Note:** Host permission is required.
  */
    pageUrl?: string
  /**
   * The URL of the frame of the element where the context menu was clicked, if it was in a frame. **Note:** Host permission is required.
  */
    frameUrl?: string
  /**
   * The text for the context selection, if any. **Note:** Host permission is required.
  */
    selectionText?: string
  /**
   * An identifier of the clicked content element, if any. Use $(ref:menus.getTargetElement) in the page to find the corresponding element.
  */
    targetElementId?: number
  /**
   * An identifier of the clicked Thunderbird UI element, if any.
  */
    fieldId?: 'composeSubject'
 | 'composeTo'
 | 'composeCc'
 | 'composeBcc'
 | 'composeReplyTo'
 | 'composeNewsgroupTo'
  /**
   * The selected message(s) in the message list (a.k.a. the thread pane). Only available for the <var>message_list</var> context. The <permission>messagesRead</permission> permission is required. The returned selection includes the messages which would be affected by a context action through Thunderbirds UI, which may not be the actuall selected messages. For example, if the user has multiple messages selected and opens the context menu for a message outside that selection, only the message for which the context menu was opened, is returned.
  */
    selectedMessages?:  messages.MessageList
  /**
   * The displayed folder. Only available for the <var>message_list</var> context. The <permission>accountsRead</permission> permission is required.
  */
    displayedFolder?:  folders.MailFolder
  /**
   * The selected folder in the folder pane (where the context menu was opened). Only available for the <var>folder_pane</var> context. The <permission>accountsRead</permission> permission is required.
  */
    selectedFolder?:  folders.MailFolder
  /**
   * The selected folders in the folder pane. Only available for the <var>folder_pane</var> context. The <permission>accountsRead</permission> permission is required. The returned selection includes the folders which would be affected by a context action through Thunderbirds UI, which may not be the actuall selected folders. For example, if the user has multiple folders selected and opens the context menu for a folder outside that selection, only the folder for which the context menu was opened, is returned.
  */
    selectedFolders?: folders.MailFolder[]
  /**
   * The selected account in the folder pane, if the context menu was opened on an account entry. Only available for the <var>folder_pane</var> context. The <permission>accountsRead</permission> permission is required.
  */
    selectedAccount?:  accounts.MailAccount
  /**
   * The selected attachments. The <permission>compose</permission> permission is required to return attachments of a message being composed. The <permission>messagesRead</permission> permission is required to return attachments of displayed messages.
  */
    attachments?: []

  }

  /**
 * Information sent when a context menu item is clicked.
  */
  export interface OnClickData {
  /**
   * The ID of the menu item that was clicked.
  */
    menuItemId: number | string
  /**
   * The parent ID, if any, for the item clicked.
  */
    parentMenuItemId?: number | string
  /**
   * A flag indicating whether the element is editable (text input, textarea, etc.).
  */
    editable: boolean
  /**
   * One of <var>image</var>, <var>video</var>, or <var>audio</var> if the context menu was activated on one of these types of elements.
  */
    mediaType?: string
  /**
   * The type of view where the menu is clicked. May be unset if the menu is not associated with a view.
  */
    viewType?:  extension.ViewType
  /**
   * If the element is a link, the text of that link.
  */
    linkText?: string
  /**
   * If the element is a link, the URL it points to.
  */
    linkUrl?: string
  /**
   * Will be present for elements with a *src* URL.
  */
    srcUrl?: string
  /**
   * The URL of the page where the menu item was clicked. This property is not set if the click occurred in a context where there is no current page, such as in a launcher context menu.
  */
    pageUrl?: string
  /**
   * The id of the frame of the element where the context menu was clicked.
  */
    frameId?: number
  /**
   * The URL of the frame of the element where the context menu was clicked, if it was in a frame.
  */
    frameUrl?: string
  /**
   * The text for the context selection, if any.
  */
    selectionText?: string
  /**
   * A flag indicating the state of a checkbox or radio item before it was clicked.
  */
    wasChecked?: boolean
  /**
   * A flag indicating the state of a checkbox or radio item after it is clicked.
  */
    checked?: boolean
  /**
   * An array of keyboard modifiers that were held while the menu item was clicked.
  */
    modifiers: 'Shift'
 | 'Alt'
 | 'Command'
 | 'Ctrl'
 | 'MacCtrl'[]
  /**
   * An integer value of button by which menu item was clicked.
  */
    button?: number
  /**
   * An identifier of the clicked content element, if any. Use $(ref:menus.getTargetElement) in the page to find the corresponding element.
  */
    targetElementId?: number
  /**
   * An identifier of the clicked Thunderbird UI element, if any.
  */
    fieldId?: 'composeSubject'
 | 'composeTo'
 | 'composeCc'
 | 'composeBcc'
 | 'composeReplyTo'
 | 'composeNewsgroupTo'
  /**
   * The selected message(s) in the message list (a.k.a. the thread pane). Only available for the <var>message_list</var> context. The <permission>messagesRead</permission> permission is required. The returned selection includes the messages which would be affected by a context action through Thunderbirds UI, which may not be the actuall selected messages. For example, if the user has multiple messages selected and opens the context menu for a message outside that selection, only the message for which the context menu was opened, is returned.
  */
    selectedMessages?:  messages.MessageList
  /**
   * The displayed folder. Only available for the <var>message_list</var> context. The <permission>accountsRead</permission> permission is required.
  */
    displayedFolder?:  folders.MailFolder
  /**
   * The selected folder in the folder pane (where the context menu was opened). Only available for the <var>folder_pane</var> context. The <permission>accountsRead</permission> permission is required.
  */
    selectedFolder?:  folders.MailFolder
  /**
   * The selected folders in the folder pane. Only available for the <var>folder_pane</var> context. The <permission>accountsRead</permission> permission is required. The returned selection includes the folders which would be affected by a context action through Thunderbirds UI, which may not be the actuall selected folders. For example, if the user has multiple folders selected and opens the context menu for a folder outside that selection, only the folder for which the context menu was opened, is returned.
  */
    selectedFolders?: folders.MailFolder[]
  /**
   * The selected account in the folder pane, if the context menu was opened on an account entry. Only available for the <var>folder_pane</var> context. The <permission>accountsRead</permission> permission is required.
  */
    selectedAccount?:  accounts.MailAccount
  /**
   * The selected attachments. The <permission>compose</permission> permission is required to return attachments of a message being composed. The <permission>messagesRead</permission> permission is required to return attachments of displayed messages.
  */
    attachments?: []

  }

  /**
 * The path for a menu icon may be a relative path to an icon file, a <var>moz-extension:</var> URL, an image <var>data:</var> URL, a <var>blob:</var> URL, or a remote <var>http(s):</var> URL.
  */
  type MenuIconPath = string | string;
  /**
 * A *dictionary object* to specify paths for multiple icons in different sizes, so the best matching icon can be used, instead of scaling a standard icon to fit the pixel density of the user's display. Each entry is a *name-value* pair, with *name* being a size and *value* being a $(ref:menus.MenuIconPath). Example: <literalinclude>includes/IconPath.json<lang>JSON</lang></literalinclude>See the <a href='url-choosing-icon-size'>MDN documentation about choosing icon sizes</a> for more information on this. 
  */
  export interface MenuIconDictionary {
  }

  /**
 * Creates a new context menu item. Note that if an error occurs during creation, you may not find out until the creation callback fires (the details will be in <a href='url-runtime-last-error'>runtime.lastError</a>).
  */
  function create(createProperties: {
    /**
   * The type of menu item. Defaults to <var>normal</var> if not specified.
  */
    type?: ItemType
  /**
   * The unique ID to assign to this item. Mandatory for event pages. Cannot be the same as another ID for this extension.
  */
    id?: string
  /**
   * Custom icons to display next to the menu item. Custom icons can only be set for items appearing in submenus.
  */
    icons?: MenuIconPath | MenuIconDictionary
  /**
   * The text to be displayed in the item; this is *required* unless <var>type</var> is <var>separator</var>. When the context is <var>selection</var>, you can use <var>%s</var> within the string to show the selected text. For example, if this parameter's value is <var>Translate '%s' to Latin</var> and the user selects the word <var>cool</var>, the context menu item for the selection is <var>Translate 'cool' to Latin</var>. To specify an access key for the new menu entry, include a <var>&</var> before the desired letter in the title. For example <var>&Help</var>.
  */
    title?: string
  /**
   * The initial state of a checkbox or radio item: <var>true</var> for selected and <var>false</var> for unselected. Only one radio item can be selected at a time in a given group of radio items.
  */
    checked?: boolean
  /**
   * List of contexts this menu item will appear in. Defaults to <var>['page']</var> if not specified.
  */
    contexts?: ContextType[]
  /**
   * List of view types where the menu item will be shown. Defaults to any view, including those without a viewType.
  */
    viewTypes?: extension.ViewType[]
  /**
   * Whether the item is visible in the menu.
  */
    visible?: boolean
  /**
   * A function that will be called back when the menu item is clicked. Event pages cannot use this.
  */
    onclick?: /* or any?  */   (/**
 * Information about the item clicked and the context where the click happened.
  */

info: OnClickData, /**
 * The details of the tab where the click took place.
  */

tab:  tabs.Tab) => void , 
 /* x7 */ 

  /**
   * The ID of a parent menu item; this makes the item a child of a previously added item.
  */
    parentId?: number | string
  /**
   * Lets you restrict the item to apply only to documents whose URL matches one of the given patterns. (This applies to frames as well.) For details on the format of a pattern, see <a href='url-match-patterns'>Match Patterns</a>.
  */
    documentUrlPatterns?: string[]
  /**
   * Similar to documentUrlPatterns, but lets you filter based on the src attribute of img/audio/video tags and the href of anchor tags.
  */
    targetUrlPatterns?: string[]
  /**
   * Whether this context menu item is enabled or disabled. Defaults to true.
  */
    enabled?: boolean
    command?: string | string

  }): undefined;
  /**
 * Updates a previously created context menu item.
  */
  function update(/**
 * The ID of the item to update.
  */

id: number | string, /**
 * The properties to update. Accepts the same values as the create function.
  */

updateProperties: {
      type?: ItemType
    icons?: MenuIconPath | MenuIconDictionary
    title?: string
    checked?: boolean
    contexts?: ContextType[]
    viewTypes?: extension.ViewType[]
  /**
   * Whether the item is visible in the menu.
  */
    visible?: boolean
    onclick?: /* or any?  */   (info: OnClickData, /**
 * The details of the tab where the click took place. **Note:** this parameter only present for extensions.
  */

tab:  tabs.Tab) => void , 
 /* x7 */ 

  /**
   * **Note:** You cannot change an item to be a child of one of its own descendants.
  */
    parentId?: number | string
    documentUrlPatterns?: string[]
    targetUrlPatterns?: string[]
    enabled?: boolean

  }): Promise<void | null>;
  /**
 * Removes a context menu item.
  */
  function remove(/**
 * The ID of the context menu item to remove.
  */

menuItemId: number | string): Promise<void | null>;
  /**
 * Removes all context menu items added by this extension.
  */
  function removeAll(): Promise<void | null>;
  /**
 * Show the matching menu items from this extension instead of the default menu. This should be called during a <a href='url-contextmenu-event'>contextmenu</a> event handler, and only applies to the menu that opens after this event.
  */
  function overrideContext(contextOptions: {
    /**
   * Whether to also include default menu items in the menu.
  */
    showDefaults?: boolean
  /**
   * ContextType to override, to allow menu items from other extensions in the menu. Currently only <var>tab</var> is supported. <var>contextOptions.showDefaults</var> cannot be used with this option.
  */
    context?: 'tab'
  /**
   * Required when context is <var>tab</var>. Requires the <permission>tabs</permission> permission.
  */
    tabId?: number

  }): void;
  /**
 * Updates the extension items in the shown menu, including changes that have been made since the menu was shown. Has no effect if the menu is hidden. Rebuilding a shown menu is an expensive operation, only invoke this method when necessary.
  */
  function refresh(): Promise<any>;
  /**
 * Retrieve the element that was associated with a recent <a href='url-contextmenu-event'>contextmenu</a> event.
  */
  function getTargetElement(/**
 * The identifier of the clicked element, available as <var>info.targetElementId</var> in the $(ref:menus.onShown) and $(ref:menus.onClicked) events.
  */

targetElementId: number): object;
    const onClicked: EventHandler<  /**
 * Fired when a context menu item is clicked. This is a user input event handler. For asynchronous listeners some <a href='url-user-input-restrictions'>restrictions</a> apply.
  */
  ((/**
 * Information about the item clicked and the context where the click happened.
  */

info: OnClickData, /**
 * The details of the tab where the click took place. If the click did not take place in a tab, this parameter will be missing.
  */

tab?:  tabs.Tab) => void)>;
    const onShown: EventHandler<  /**
 * Fired when a menu is shown. The extension can add, modify or remove menu items and call $(ref:menus.refresh) to update the menu.
  */
  ((/**
 * Information about the context of the menu action and the created menu items.
  */

info: OnShowData, /**
 * The details of the tab where the menu was opened.
  */

tab:  tabs.Tab) => void)>;
    const onHidden: EventHandler<  /**
 * Fired when a menu is hidden. This event is only fired if onShown has fired before.
  */
  (() => void)>;
  /**
 * The maximum number of top level extension items that can be added to an extension action context menu. Any items beyond this limit will be ignored.
  */
const ACTION_MENU_TOP_LEVEL_LIMIT = 6;
}

declare namespace browser.messengerUtilities {
  /**
 * Representation of a parsed mailbox string (see RFC 5322, section 3.4).
  */
  export interface ParsedMailbox {
  /**
   * The <var>display-name</var> associated with the provided address or group, if available.
  */
    name?: string
  /**
   * The <var>addr-spec</var> associated with the provided address, if available.
  */
    email?: string
  /**
   * The members of the group, if available.
  */
    group?: messengerUtilities.ParsedMailbox[]

  }

  /**
 * Converts the provided body to readable plain text, without tags and leading/trailing whitespace.
  */
  function convertToPlainText(/**
 * The to-be-converted body.
  */

body: string, options?: {
    /**
   * The converted plain text will be wrapped to lines not longer than 72 characters and use format flowed, as defined by RFC 2646.
  */
    flowed?: boolean

  }): Promise<string | null>;
  /**
 * Returns the provided file size in a human readable format (e.g. <var>12 bytes</var> or <var>11,4 GB</var>).
  */
  function formatFileSize(/**
 * The size in bytes.
  */

sizeInBytes: number): Promise<string | null>;
  /**
 * Parse a mailbox string containing one or more email addresses (see RFC 5322, section 3.4).
  */
  function parseMailboxString(/**
 * The string to be parsed (e.g. <var>User <user@example.com>, other-user@example.com</var>)
  */

mailboxString: string, /**
 * Keep grouped hierachies. Groups may be specified in a mailbox string as follows: <var>GroupName : user1 <user1@example.com>, user2@example,com ;</var>.
  */

preserveGroups?: boolean): Promise<messengerUtilities.ParsedMailbox[] | null>;
}

declare namespace browser.scripting.compose {
  export interface ComposeScriptDetails {
  /**
   * The id of the compose script, specified in the API call.
  */
    id: string
  /**
   * The list of JavaScript files to be injected. These are injected in the order they appear in this array.
  */
    js?: manifest.ExtensionURL[]
  /**
   * Specifies when JavaScript files are injected. The preferred and default value is `document_idle`.
  */
    runAt?:  extensionTypes.RunAt
  /**
   * The list of CSS files to be injected. These are injected in the order they appear in this array.
  */
    css?: manifest.ExtensionURL[]

  }

  export interface ComposeScriptFilter {
  /**
   * The IDs of specific compose scripts to retrieve with `getRegisteredScripts()` or to unregister with `unregisterScripts()`.
  */
    ids?: string[]

  }

  /**
 * Returns all registered compose scripts for this extension that match the given filter.
  */
  function getRegisteredScripts(/**
 * An object to filter the extension's registered compose scripts.
  */

filter?: ComposeScriptFilter): Promise<ComposeScriptDetails[]>;
  /**
 * Registers one or more compose scripts for this extension, which should be injected into the message compose editor. **Note:** Registered scripts will only be applied to newly opened message compose tabs. To apply the script to already open message compose tabs, manually inject your script by calling $(ref:scripting.executeScript) for each of the open <var>messageCompose</var> tabs.
  */
  function registerScripts(/**
 * Contains a list of compose scripts to be registered. If there are errors during script parsing/file validation, or if the IDs specified already exist, then no scripts are registered.
  */

scripts: ComposeScriptDetails[]): Promise<void>;
  /**
 * Unregisters one or more compose scripts for this extension.
  */
  function unregisterScripts(/**
 * If specified, only unregisters compose scripts which match the filter. Otherwise, all of the extension's compose scripts are unregistered.
  */

filter?: ComposeScriptFilter): Promise<void>;
}

declare namespace browser.scripting.messageDisplay {
  export interface MessageDisplayScriptDetails {
  /**
   * The id of the message display script, specified in the API call.
  */
    id: string
  /**
   * The list of JavaScript files to be injected. These are injected in the order they appear in this array.
  */
    js?: manifest.ExtensionURL[]
  /**
   * Specifies when JavaScript files are injected. The preferred and default value is `document_idle`.
  */
    runAt?:  extensionTypes.RunAt
  /**
   * The list of CSS files to be injected. These are injected in the order they appear in this array.
  */
    css?: manifest.ExtensionURL[]

  }

  export interface MessageDisplayScriptFilter {
  /**
   * The IDs of specific message display scripts to retrieve with `getRegisteredScripts()` or to unregister with `unregisterScripts()`.
  */
    ids?: string[]

  }

  /**
 * Returns all registered message display scripts for this extension that match the given filter.
  */
  function getRegisteredScripts(/**
 * An object to filter the extension's registered message display scripts.
  */

filter?: MessageDisplayScriptFilter): Promise<MessageDisplayScriptDetails[]>;
  /**
 * Registers one or more message display scripts for this extension, which should be injected into displayed messages. **Note:** Registered scripts will only be applied to newly opened messages. To apply the script to already open messages, manually inject your script by calling $(ref:scripting.executeScript) for each of the open <var>messageDisplay</var> tabs.
  */
  function registerScripts(/**
 * Contains a list of message display scripts to be registered. If there are errors during script parsing/file validation, or if the IDs specified already exist, then no scripts are registered.
  */

scripts: MessageDisplayScriptDetails[]): Promise<void>;
  /**
 * Unregisters one or more message display scripts for this extension.
  */
  function unregisterScripts(/**
 * If specified, only unregisters message display scripts which match the filter. Otherwise, all of the extension's message display scripts are unregistered.
  */

filter?: MessageDisplayScriptFilter): Promise<void>;
}

declare namespace browser.spacesToolbar {
  export interface ButtonProperties {
  /**
   * Sets the background color of the badge. Can be specified as an array of four integers in the range [0,255] that make up the RGBA color of the badge. For example, opaque red is <var>[255, 0, 0, 255]</var>. Can also be a string with an HTML color name (<var>red</var>) or a HEX color value (<var>#FF0000</var> or <var>#F00</var>). Reset when set to an empty string.
  */
    badgeBackgroundColor?: string | ColorArray
  /**
   * Sets the badge text for the spaces toolbar button. The badge is displayed on top of the icon. Any number of characters can be set, but only about four can fit in the space. Removed when set to an empty string.
  */
    badgeText?: string
  /**
   * The paths to one or more icons for the button in the spaces toolbar. Defaults to the extension icon, if set to an empty string.
  */
    defaultIcons?: string |  manifest.IconPath
  /**
   * Specifies dark and light icons for the spaces toolbar button to be used with themes: The <var>light</var> icons will be used on dark backgrounds and vice versa. At least the set for *16px* icons should be specified. The set for *32px* icons will be used on screens with a very high pixel density, if specified.
  */
    themeIcons?: manifest.ThemeIcons[]
  /**
   * The title for the spaces toolbar button, used in the tooltip of the button and as the displayed name in the overflow menu. Defaults to the name of the extension, if set to an empty string.
  */
    title?: string
  /**
   * The page url, loaded into a tab when the button is clicked. Supported are <var>https://</var> and <var>http://</var> links, as well as links to WebExtension pages.
  */
    url?: string

  }

  /**
 * An array of four integers in the range [0,255] that make up the RGBA color. For example, opaque red is <var>[255, 0, 0, 255]</var>.
  */
  type ColorArray = number[];
  /**
 * Adds a new button to the spaces toolbar. Throws an exception, if the used <var>id</var> is not unique within the extension.
  */
  function addButton(/**
 * The unique id to assign to this button. May only contain alphanumeric characters and underscores.
  */

id: string, /**
 * Properties of the new button. The <var>url</var> is mandatory.
  */

properties:  spacesToolbar.ButtonProperties): Promise<number | null>;
  /**
 * Removes the specified button from the spaces toolbar. Throws an exception if the requested spaces toolbar button does not exist or was not created by this extension. If the tab of this button is currently open, it will be closed.
  */
  function removeButton(/**
 * The id of the spaces toolbar button, which is to be removed. May only contain alphanumeric characters and underscores.
  */

id: string): Promise<any>;
  /**
 * Updates properties of the specified spaces toolbar button. Throws an exception if the requested spaces toolbar button does not exist or was not created by this extension.
  */
  function updateButton(/**
 * The id of the spaces toolbar button, which is to be updated. May only contain alphanumeric characters and underscores.
  */

id: string, /**
 * Only specified properties will be updated.
  */

properties:  spacesToolbar.ButtonProperties): Promise<any>;
  /**
 * Trigger a click on the specified spaces toolbar button. Throws an exception if the requested spaces toolbar button does not exist or was not created by this extension.
  */
  function clickButton(/**
 * The id of the spaces toolbar button. May only contain alphanumeric characters and underscores.
  */

id: string, /**
 * The id of the normal window, where the spaces toolbar button should be clicked. Defaults to the most recent normal window.
  */

windowId?: number): Promise< tabs.Tab | null>;
}

declare namespace browser.composeScripts {
  /**
 * Details of a compose script registered programmatically.
  */
  export interface RegisteredComposeScriptOptions {
  /**
   * The list of CSS files to inject.
  */
    css?: extensionTypes.ExtensionFileOrCode[]
  /**
   * The list of JavaScript files to inject.
  */
    js?: extensionTypes.ExtensionFileOrCode[]

  }

  /**
 * An object that represents a compose script registered programmatically.
  */
  export interface RegisteredComposeScript {
  /**
 * Unregister a compose script registered programmatically.
  */

  unregister(): Promise<any>;


  }

  /**
 * Register a compose script programmatically. **Note:** Registered scripts will only be applied to newly opened message composer tabs. To apply the script to already open message composer tab, manually inject your script by calling $(ref:tabs.executeScript) for each of the open <var>messageCompose</var> tabs.
  */
  function register(composeScriptOptions: RegisteredComposeScriptOptions): Promise<any>;
}

declare namespace browser.messageDisplayScripts {
  /**
 * Details of a message display script registered programmatically
  */
  export interface RegisteredMessageDisplayScriptOptions {
  /**
   * The list of CSS files to inject
  */
    css?: extensionTypes.ExtensionFileOrCode[]
  /**
   * The list of JavaScript files to inject
  */
    js?: extensionTypes.ExtensionFileOrCode[]
  /**
   * Determines when the files specified in css and js are injected. The states directly correspond to `Document.readyState`: <var>loading</var>, <var>interactive</var> and <var>complete</var>
  */
    runAt?: 'document_start'
 | 'document_end'
 | 'document_idle'

  }

  /**
 * An object that represents a message display script registered programmatically
  */
  export interface RegisteredMessageDisplayScript {
  /**
 * Unregister a message display script registered programmatically
  */

  unregister(): Promise<any>;


  }

  /**
 * Register a message display script programmatically. **Note:** Registered scripts will only be applied to newly opened messages. To apply the script to already open messages, manually inject your script by calling $(ref:tabs.executeScript) for each of the open <var>messageDisplay</var> tabs.
  */
  function register(messageDisplayScriptOptions: RegisteredMessageDisplayScriptOptions): Promise<any>;
}

declare namespace browser.accounts {
  /**
 * An object describing a mail account, as returned for example by the $(ref:accounts.list) and $(ref:accounts.get) methods.
  */
  export interface MailAccount {
  /**
   * A unique identifier for this account.
  */
    id: MailAccountId
  /**
   * The human-friendly name of this account.
  */
    name: string
  /**
   * What sort of account this is, e.g. <var>imap</var>, <var>nntp</var>, or <var>pop3</var>.
  */
    type: string
  /**
   * The folders for this account. The property may be <var>null</var>, if inclusion of folders had not been requested.
  */
    folders: folders.MailFolder[] | void /* could not determine correct type */
  /**
   * The root folder associated with this account.
  */
    rootFolder:  folders.MailFolder
  /**
   * The identities associated with this account. The default identity is listed first, others in no particular order.
  */
    identities: identities.MailIdentity[]

  }

  /**
 * A unique id representing a $(ref:accounts.MailAccount).
  */
  /**
 * A unique id representing a $(ref:accounts.MailAccount).
  */
  type MailAccountId = string;
  /**
 * The type of an account.
  */
  type MailAccountType = 'imap'
 | 'pop3'
 | 'nntp'
 | 'none' | 'imap'
 | 'pop3'
 | 'nntp'
 | 'local';
  /**
 * Returns all mail accounts. They will be returned in the same order as used in Thunderbird's folder pane.
  */
  function list(/**
 * Specifies whether the $(ref:folders.MailFolder) in the <var>rootFolder</var> property of each found $(ref:accounts.MailAccount) should populate its <var>subFolders</var> property, and include all (nested!) subfolders. Defaults to <var>false</var>.
  */

includeSubFolders?: boolean): Promise<accounts.MailAccount[] | null>;
  /**
 * Returns all mail accounts. They will be returned in the same order as used in Thunderbird's folder pane.
  */
  function list(/**
 * Specifies whether the $(ref:folders.MailFolder) in the <var>rootFolder</var> property of each found $(ref:accounts.MailAccount) should populate its <var>subFolders</var> property, and include all (nested!) subfolders. This also affects the deprecated <var>folders</var> property of each found $(ref:accounts.MailAccount). Defaults to <var>true</var>.
  */

includeSubFolders?: boolean): Promise<accounts.MailAccount[] | null>;
  /**
 * Returns details of the requested account, or <var>null</var> if it doesn't exist.
  */
  function get(accountId: MailAccountId, /**
 * Specifies whether the $(ref:folders.MailFolder) in the <var>rootFolder</var> property of the returned $(ref:accounts.MailAccount) should populate its <var>subFolders</var> property, and include all (nested!) subfolders. Defaults to <var>false</var>.
  */

includeSubFolders?: boolean): Promise< accounts.MailAccount | null>;
  /**
 * Returns details of the requested account, or <var>null</var> if it doesn't exist.
  */
  function get(accountId: MailAccountId, /**
 * Specifies whether the $(ref:folders.MailFolder) in the <var>rootFolder</var> property of the returned $(ref:accounts.MailAccount) should populate its <var>subFolders</var> property, and include all (nested!) subfolders. This also affects the deprecated <var>folders</var> property of the returned $(ref:accounts.MailAccount). Defaults to <var>true</var>.
  */

includeSubFolders?: boolean): Promise< accounts.MailAccount | void /* could not determine correct type */ | null>;
  /**
 * Returns the default account, or <var>null</var> if it is not defined.
  */
  function getDefault(/**
 * Specifies whether the $(ref:folders.MailFolder) in the <var>rootFolder</var> property of the default $(ref:accounts.MailAccount) should populate its <var>subFolders</var> property, and include all (nested!) subfolders. Defaults to <var>false</var>
  */

includeSubFolders?: boolean): Promise< accounts.MailAccount | void /* could not determine correct type */ | null>;
  /**
 * Returns the default account, or <var>null</var> if it is not defined.
  */
  function getDefault(/**
 * Specifies whether the $(ref:folders.MailFolder) in the <var>rootFolder</var> property of the default $(ref:accounts.MailAccount) should populate its <var>subFolders</var> property, and include all (nested!) subfolders. This also affects the deprecated <var>folders</var> property of the default $(ref:accounts.MailAccount). Defaults to <var>true</var>
  */

includeSubFolders?: boolean): Promise< accounts.MailAccount | void /* could not determine correct type */ | null>;
  /**
 * Sets the default identity for an account.
  */
  function setDefaultIdentity(accountId: MailAccountId, identityId: string): Promise<any>;
  /**
 * Returns the default identity for an account, or <var>null</var> if it is not defined.
  */
  function getDefaultIdentity(accountId: MailAccountId): Promise< identities.MailIdentity | void /* could not determine correct type */ | null>;
    const onCreated: EventHandler<  /**
 * Fired when a new account has been created.
  */
  ((accountId: MailAccountId, account: MailAccount) => void)>;
    const onDeleted: EventHandler<  /**
 * Fired when an account has been removed.
  */
  ((accountId: MailAccountId) => void)>;
    const onUpdated: EventHandler<  /**
 * Fired when a property of an account has been modified. Folders and identities of accounts are not monitored by this event, use the dedicated folder and identity events instead. A changed <var>defaultIdentity</var> is reported only after a different identity has been assigned as default identity, but not after a property of the default identity has been changed.
  */
  ((accountId: MailAccountId, changedValues: {
    /**
   * The human-friendly name of this account.
  */
    name: string
  /**
   * The default identity of this account.
  */
    defaultIdentity:  identities.MailIdentity

  }) => void)>;
}

declare namespace browser.cloudFile {
  /**
 * Information about a cloud file account.
  */
  export interface CloudFileAccount {
  /**
   * Unique identifier of the account.
  */
    id: string
  /**
   * If true, the account is configured and ready to use. Only configured accounts are offered to the user.
  */
    configured: boolean
  /**
   * A user-friendly name for this account.
  */
    name: string
  /**
   * The maximum size in bytes for a single file to upload. Set to <var>-1</var> if unlimited.
  */
    uploadSizeLimit?: number
  /**
   * The amount of remaining space on the cloud provider, in bytes. Set to <var>-1</var> if unsupported.
  */
    spaceRemaining?: number
  /**
   * The amount of space already used on the cloud provider, in bytes. Set to <var>-1</var> if unsupported.
  */
    spaceUsed?: number
  /**
   * A page for configuring accounts, to be displayed in the preferences UI.
  */
    managementUrl: string

  }

  /**
 * Defines information to be used in the cloud file entry added to the message.
  */
  export interface CloudFileTemplateInfo {
  /**
   * A URL pointing to an icon to represent the used cloud file service. Defaults to the icon of the provider add-on.
  */
    service_icon?: string
  /**
   * A name to represent the used cloud file service. Defaults to the associated cloud file account name.
  */
    service_name?: string
  /**
   * A URL pointing to a web page of the used cloud file service. Will be used in a *Learn more about* link in the footer of the cloud file attachment element.
  */
    service_url?: string
  /**
   * If set to true, the cloud file entry for this upload will include a hint, that the download link is password protected.
  */
    download_password_protected?: boolean
  /**
   * If set, the cloud file entry for this upload will include a hint, that the file has a download limit.
  */
    download_limit?: number
  /**
   * If set, the cloud file entry for this upload will include a hint, that the link will only be available for a limited time.
  */
    download_expiry_date?: {
    /**
   * The expiry date of the link as the number of milliseconds since the UNIX epoch.
  */
    timestamp: number
  /**
   * A format options object as used by <a href='url-date-time-format'>Intl.DateTimeFormat</a>. Defaults to: <literalinclude>includes/cloudFile/defaultDateFormat.js<lang>JavaScript</lang></literalinclude>
  */
    format?: /* "unknown" undefined */ object

  }

  }

  /**
 * Information about a cloud file.
  */
  export interface CloudFile {
  /**
   * An identifier for this file.
  */
    id: number
  /**
   * Filename of the file to be transferred.
  */
    name: string
  /**
   * Contents of the file to be transferred.
  */
    data: /* "unknown" undefined */ object

  }

  /**
 * Information about an already uploaded cloud file, which is related to a new upload. For example if the content of a cloud attachment is updated, if a repeatedly used cloud attachment is renamed (and therefore should be re-uploaded to not invalidate existing links) or if the provider has its manifest property <var>reuse_uploads</var> set to <var>false</var>.
  */
  export interface RelatedCloudFile {
  /**
   * The identifier for the related file. In some circumstances, the id is unavailable.
  */
    id?: number
  /**
   * The URL where the upload of the related file can be accessed.
  */
    url?: string
  /**
   * Additional information of the related file, used in the cloud file entry added to the message.
  */
    templateInfo?: CloudFileTemplateInfo
  /**
   * Filename of the related file.
  */
    name: string
  /**
   * The content of the new upload differs from the related file.
  */
    dataChanged: boolean

  }

  /**
 * Retrieve information about a single cloud file account, or <var>undefined</var> if it does not exists
  */
  function getAccount(/**
 * Unique identifier of the account.
  */

accountId: string): Promise<CloudFileAccount | null>;
  /**
 * Retrieve all cloud file accounts for the current add-on.
  */
  function getAllAccounts(): Promise<CloudFileAccount[] | null>;
  /**
 * Update a cloud file account.
  */
  function updateAccount(/**
 * Unique identifier of the account.
  */

accountId: string, updateProperties: {
    /**
   * If true, the account is configured and ready to use. Only configured accounts are offered to the user.
  */
    configured?: boolean
  /**
   * The maximum size in bytes for a single file to upload. Set to <var>-1</var> if unlimited.
  */
    uploadSizeLimit?: number
  /**
   * The amount of remaining space on the cloud provider, in bytes. Set to <var>-1</var> if unsupported.
  */
    spaceRemaining?: number
  /**
   * The amount of space already used on the cloud provider, in bytes. Set to <var>-1</var> if unsupported.
  */
    spaceUsed?: number
  /**
   * A page for configuring accounts, to be displayed in the preferences UI.
  */
    managementUrl?: string

  }): Promise<CloudFileAccount | null>;
    const onFileUpload: EventHandler<  /**
 * Fired when a file should be uploaded to the cloud file provider.
  */
  ((/**
 * The account used for the file upload.
  */

account: CloudFileAccount, /**
 * The file to upload.
  */

fileInfo: CloudFile, /**
 * The tab where the upload was initiated. Currently only available for the message composer.
  */

tab:  tabs.Tab, /**
 * Information about an already uploaded file, which is related to this upload.
  */

relatedFileInfo?: RelatedCloudFile) => object)>;
    const onFileUploadAbort: EventHandler<  ((/**
 * The account used for the file upload.
  */

account: CloudFileAccount, /**
 * An identifier for this file.
  */

fileId: number, /**
 * The tab where the upload was initiated. Currently only available for the message composer.
  */

tab:  tabs.Tab) => void)>;
    const onFileRename: EventHandler<  /**
 * Fired when a previously uploaded file should be renamed.
  */
  ((/**
 * The account used for the file upload.
  */

account: CloudFileAccount, /**
 * An identifier for the file which should be renamed.
  */

fileId: number, /**
 * The new name of the file.
  */

newName: string, /**
 * The tab where the rename was initiated. Currently only available for the message composer.
  */

tab:  tabs.Tab) => object)>;
    const onFileDeleted: EventHandler<  /**
 * Fired when a previously uploaded file should be deleted.
  */
  ((/**
 * The account used for the file upload.
  */

account: CloudFileAccount, /**
 * An identifier for this file.
  */

fileId: number, /**
 * The tab where the upload was initiated. Currently only available for the message composer.
  */

tab:  tabs.Tab) => void)>;
    const onAccountAdded: EventHandler<  /**
 * Fired when a cloud file account of this add-on was created.
  */
  ((/**
 * The created account.
  */

account: CloudFileAccount) => void)>;
    const onAccountDeleted: EventHandler<  /**
 * Fired when a cloud file account of this add-on was deleted.
  */
  ((/**
 * The id of the removed account.
  */

accountId: string) => void)>;
}

declare namespace browser.permissions {
  export interface Permissions {
    permissions?: manifest.OptionalPermission[]
    origins?: manifest.MatchPattern[]

  }

  export interface AnyPermissions {
    permissions?: manifest.Permission[]
    origins?: manifest.MatchPattern[]

  }

  /**
 * Get a list of all the extension's permissions.
  */
  function getAll(): Promise<AnyPermissions>;
  /**
 * Check if the extension has the given permissions.
  */
  function contains(permissions: AnyPermissions): Promise<boolean>;
  /**
 * Request the given permissions.
  */
  function request(permissions: Permissions): Promise<boolean>;
  /**
 * Relinquish the given permissions.
  */
  function remove(permissions: Permissions): Promise<void>;
    const onAdded: EventHandler<  /**
 * Fired when the extension acquires new permissions.
  */
  ((permissions: Permissions) => void)>;
    const onRemoved: EventHandler<  /**
 * Fired when permissions are removed from the extension.
  */
  ((permissions: Permissions) => void)>;
}

  /**
 * Use the scripting API to execute script in different contexts.
  */
declare namespace browser.scripting {
  /**
 * Details of a script injection
  */
  export interface ScriptInjection {
  /**
   * The arguments to curry into a provided function. This is only valid if the `func` parameter is specified. These arguments must be JSON-serializable.
  */
    args?: any[]
  /**
   * The path of the JS files to inject, relative to the extension's root directory. Exactly one of `files` and `func` must be specified.
  */
    files?: string[]
  /**
   * A JavaScript function to inject. This function will be serialized, and then deserialized for injection. This means that any bound parameters and execution context will be lost. Exactly one of `files` and `func` must be specified.
  */
    func?: /* or any?  */   () => void , 
 /* x7 */ 

  /**
   * Details specifying the target into which to inject the script.
  */
    target: InjectionTarget
    world?: ExecutionWorld
  /**
   * Whether the injection should be triggered in the target as soon as possible (but not necessarily prior to page load).
  */
    injectImmediately?: boolean

  }

  /**
 * Result of a script injection.
  */
  export interface InjectionResult {
  /**
   * The frame ID associated with the injection.
  */
    frameId: number
  /**
   * The result of the script execution.
  */
    result?: any
  /**
   * The error property is set when the script execution failed. The value is typically an (Error) object with a message property, but could be any value (including primitives and undefined) if the script threw or rejected with such a value.
  */
    error?: any

  }

  export interface InjectionTarget {
  /**
   * The IDs of specific frames to inject into.
  */
    frameIds?: number[]
  /**
   * Whether the script should inject into all frames within the tab. Defaults to false. This must not be true if `frameIds` is specified.
  */
    allFrames?: boolean
  /**
   * The ID of the tab into which to inject.
  */
    tabId: number

  }

  export interface CSSInjection {
  /**
   * A string containing the CSS to inject. Exactly one of `files` and `css` must be specified.
  */
    css?: string
  /**
   * The path of the CSS files to inject, relative to the extension's root directory. Exactly one of `files` and `css` must be specified.
  */
    files?: string[]
  /**
   * The style origin for the injection. Defaults to `'AUTHOR'`.
  */
    origin?: 'USER'
 | 'AUTHOR'
  /**
   * Details specifying the target into which to inject the CSS.
  */
    target: InjectionTarget

  }

  export interface ContentScriptFilter {
  /**
   * The IDs of specific scripts to retrieve with `getRegisteredContentScripts()` or to unregister with `unregisterContentScripts()`.
  */
    ids?: string[]

  }

  /**
 * The JavaScript world for a script to execute within. `ISOLATED` is the default execution environment of content scripts, `MAIN` is the web page's execution environment.
  */
  /**
 * The JavaScript world for a script to execute within. `ISOLATED` is the default execution environment of content scripts, `MAIN` is the web page's execution environment.
  */
  type ExecutionWorld = string;
  export interface RegisteredContentScript {
  /**
   * If specified true, it will inject into all frames, even if the frame is not the top-most frame in the tab. Each frame is checked independently for URL requirements; it will not inject into child frames if the URL requirements are not met. Defaults to false, meaning that only the top frame is matched.
  */
    allFrames?: boolean
  /**
   * Excludes pages that this content script would otherwise be injected into.
  */
    excludeMatches?: string[]
  /**
   * The id of the content script, specified in the API call.
  */
    id: string
  /**
   * The list of JavaScript files to be injected into matching pages. These are injected in the order they appear in this array.
  */
    js?: manifest.ExtensionURL[]
  /**
   * Specifies which pages this content script will be injected into. Must be specified for `registerContentScripts()`.
  */
    matches?: string[]
  /**
   * If matchOriginAsFallback is true, then the code is also injected in about:, data:, blob: when their origin matches the pattern in 'matches', even if the actual document origin is opaque (due to the use of CSP sandbox or iframe sandbox). Match patterns in 'matches' must specify a wildcard path glob. By default it is `false`.
  */
    matchOriginAsFallback?: boolean
  /**
   * Specifies when JavaScript files are injected into the web page. The preferred and default value is `document_idle`.
  */
    runAt?:  extensionTypes.RunAt
  /**
   * The JavaScript world for a script to execute within. Defaults to "ISOLATED".
  */
    world?: ExecutionWorld
  /**
   * Specifies if this content script will persist into future sessions. Defaults to true.
  */
    persistAcrossSessions?: boolean
  /**
   * The list of CSS files to be injected into matching pages. These are injected in the order they appear in this array.
  */
    css?: manifest.ExtensionURL[]

  }

  /**
 * Injects a script into a target context. The script will be run at `document_idle`.
  */
  function executeScript(/**
 * The details of the script which to inject.
  */

injection: ScriptInjection): Promise<InjectionResult[]>;
  /**
 * Inserts a CSS stylesheet into a target context. If multiple frames are specified, unsuccessful injections are ignored.
  */
  function insertCSS(/**
 * The details of the styles to insert.
  */

injection: CSSInjection): Promise<void>;
  /**
 * Removes a CSS stylesheet that was previously inserted by this extension from a target context.
  */
  function removeCSS(/**
 * The details of the styles to remove. Note that the `css`, `files`, and `origin` properties must exactly match the stylesheet inserted through `insertCSS`. Attempting to remove a non-existent stylesheet is a no-op.
  */

injection: CSSInjection): Promise<void>;
  /**
 * Registers one or more content scripts for this extension.
  */
  function registerContentScripts(/**
 * Contains a list of scripts to be registered. If there are errors during script parsing/file validation, or if the IDs specified already exist, then no scripts are registered.
  */

scripts: RegisteredContentScript[]): Promise<void>;
  /**
 * Returns all dynamically registered content scripts for this extension that match the given filter.
  */
  function getRegisteredContentScripts(/**
 * An object to filter the extension's dynamically registered scripts.
  */

filter?: ContentScriptFilter): Promise<RegisteredContentScript[]>;
  /**
 * Unregisters one or more content scripts for this extension.
  */
  function unregisterContentScripts(/**
 * If specified, only unregisters dynamic content scripts which match the filter. Otherwise, all of the extension's dynamic content scripts are unregistered.
  */

filter?: ContentScriptFilter): Promise<void>;
  /**
 * Updates one or more content scripts for this extension.
  */
  function updateContentScripts(/**
 * Contains a list of scripts to be updated. If there are errors during script parsing/file validation, or if the IDs specified do not already exist, then no scripts are updated.
  */

scripts: {
    /**
   * Specifies if this content script will persist into future sessions.
  */
    persistAcrossSessions?: boolean

  }[]): Promise<void>;
}

declare namespace browser.privacy {
}

  /**
 * Use the `browser.privacy` API to control usage of the features in the browser that can affect a user's privacy.
  */
declare namespace browser.privacy.network {
  /**
 * The IP handling policy of WebRTC.
  */
  /**
 * The IP handling policy of WebRTC.
  */
  type IPHandlingPolicy = string;
  /**
 * An object which describes TLS minimum and maximum versions.
  */
  export interface tlsVersionRestrictionConfig {
  /**
   * The minimum TLS version supported.
  */
    minimum?: 'TLSv1'
 | 'TLSv1.1'
 | 'TLSv1.2'
 | 'TLSv1.3'
 | 'unknown'
  /**
   * The maximum TLS version supported.
  */
    maximum?: 'TLSv1'
 | 'TLSv1.1'
 | 'TLSv1.2'
 | 'TLSv1.3'
 | 'unknown'

  }

  /**
 * The mode for https-only mode.
  */
  /**
 * The mode for https-only mode.
  */
  type HTTPSOnlyModeOption = string;
  /**
 * If enabled, the browser attempts to speed up your web browsing experience by pre-resolving DNS entries, prerendering sites (`&lt;link rel='prefetch' ...&gt;`), and preemptively opening TCP and SSL connections to servers.  This preference's value is a boolean, defaulting to `true`.
  */
const networkPredictionEnabled:  types.Setting;
  /**
 * Allow users to enable and disable RTCPeerConnections (aka WebRTC).
  */
const peerConnectionEnabled:  types.Setting;
  /**
 * Allow users to specify the media performance/privacy tradeoffs which impacts how WebRTC traffic will be routed and how much local address information is exposed. This preference's value is of type IPHandlingPolicy, defaulting to `default`.
  */
const webRTCIPHandlingPolicy:  types.Setting;
  /**
 * This property controls the minimum and maximum TLS versions. This setting's value is an object of $(ref:tlsVersionRestrictionConfig).
  */
const tlsVersionRestriction:  types.Setting;
  /**
 * Allow users to query the mode for 'HTTPS-Only Mode'. This setting's value is of type HTTPSOnlyModeOption, defaulting to `never`.
  */
const httpsOnlyMode:  types.Setting;
  /**
 * Allow users to query the status of 'Global Privacy Control'. This setting's value is of type boolean, defaulting to `false`.
  */
const globalPrivacyControl:  types.Setting;
}

  /**
 * Use the `browser.privacy` API to control usage of the features in the browser that can affect a user's privacy.
  */
declare namespace browser.privacy.services {
  /**
 * If enabled, the password manager will ask if you want to save passwords. This preference's value is a boolean, defaulting to `true`.
  */
const passwordSavingEnabled:  types.Setting;
}

  /**
 * Use the `browser.privacy` API to control usage of the features in the browser that can affect a user's privacy.
  */
declare namespace browser.privacy.websites {
  /**
 * The mode for tracking protection.
  */
  /**
 * The mode for tracking protection.
  */
  type TrackingProtectionModeOption = string;
  /**
 * The settings for cookies.
  */
  export interface CookieConfig {
  /**
   * The type of cookies to allow.
  */
    behavior?: 'allow_all'
 | 'reject_all'
 | 'reject_third_party'
 | 'allow_visited'
 | 'reject_trackers'
 | 'reject_trackers_and_partition_foreign'
  /**
   * Whether to create all cookies as nonPersistent (i.e., session) cookies.
  */
    nonPersistentCookies?: boolean

  }

  /**
 * If disabled, the browser blocks third-party sites from setting cookies. The value of this preference is of type boolean, and the default value is `true`.
  */
const thirdPartyCookiesAllowed:  types.Setting;
  /**
 * If enabled, the browser sends auditing pings when requested by a website (`&lt;a ping&gt;`). The value of this preference is of type boolean, and the default value is `true`.
  */
const hyperlinkAuditingEnabled:  types.Setting;
  /**
 * If enabled, the browser sends `referer` headers with your requests. Yes, the name of this preference doesn't match the misspelled header. No, we're not going to change it. The value of this preference is of type boolean, and the default value is `true`.
  */
const referrersEnabled:  types.Setting;
  /**
 * If enabled, the browser attempts to appear similar to other users by reporting generic information to websites. This can prevent websites from uniquely identifying users. Examples of data that is spoofed include number of CPU cores, precision of JavaScript timers, the local timezone, and disabling features such as GamePad support, and the WebSpeech and Navigator APIs. The value of this preference is of type boolean, and the default value is `false`.
  */
const resistFingerprinting:  types.Setting;
  /**
 * If enabled, the browser will associate all data (including cookies, HSTS data, cached images, and more) for any third party domains with the domain in the address bar. This prevents third party trackers from using directly stored information to identify you across different websites, but may break websites where you login with a third party account (such as a Facebook or Google login.) The value of this preference is of type boolean, and the default value is `false`.
  */
const firstPartyIsolate:  types.Setting;
  /**
 * **Available on Windows and ChromeOS only**: If enabled, the browser provides a unique ID to plugins in order to run protected content. The value of this preference is of type boolean, and the default value is `true`.
  */
const protectedContentEnabled:  types.Setting;
  /**
 * Allow users to specify the mode for tracking protection. This setting's value is of type TrackingProtectionModeOption, defaulting to `private_browsing_only`.
  */
const trackingProtectionMode:  types.Setting;
  /**
 * Allow users to specify the default settings for allowing cookies, as well as whether all cookies should be created as non-persistent cookies. This setting's value is of type CookieConfig.
  */
const cookieConfig:  types.Setting;
}

  /**
 * Use the `browser.runtime` API to retrieve the background page, return details about the manifest, and listen for and respond to events in the app or extension lifecycle. You can also use this API to convert the relative path of URLs to fully-qualified URLs.
  */
declare namespace browser.runtime {
  /**
 * A filter to match against existing extension context. Matching contexts must match all specified filters.
  */
  export interface ContextFilter {
    contextIds?: string[]
    contextTypes?: ContextType[]
    documentIds?: string[]
    documentOrigins?: string[]
    documentUrls?: string[]
    frameIds?: number[]
    tabIds?: number[]
    windowIds?: number[]
    incognito?: boolean

  }

  /**
 * The type of extension view.
  */
  /**
 * The type of extension view.
  */
  type ContextType = string;
  /**
 * A context hosting extension content
  */
  export interface ExtensionContext {
  /**
   * An unique identifier associated to this context
  */
    contextId: string
  /**
   * The type of the context
  */
    contextType: ContextType
  /**
   * The origin of the document associated with this context, or undefined if it is not hosted in a document
  */
    documentOrigin?: string
  /**
   * The URL of the document associated with this context, or undefined if it is not hosted in a document
  */
    documentUrl?: string
  /**
   * Whether the context is associated with an private browsing context.
  */
    incognito: boolean
  /**
   * The frame ID for this context, or -1 if it is not hosted in a frame.
  */
    frameId: number
  /**
   * The tab ID for this context, or -1 if it is not hosted in a tab.
  */
    tabId: number
  /**
   * The window ID for this context, or -1 if it is not hosted in a window.
  */
    windowId: number

  }

  /**
 * An object which allows two way communication with other pages.
  */
  export interface Port {
    name: string
    disconnect: /* or any?  */   () => void , 
 /* x7 */ 

    onDisconnect:  events.Event
    onMessage:  events.Event
    postMessage: /* or any?  */   () => void , 
 /* x7 */ 

  /**
   * This property will **only** be present on ports passed to onConnect/onConnectExternal listeners.
  */
    sender?: MessageSender

  }

  /**
 * An object containing information about the script context that sent a message or request.
  */
  export interface MessageSender {
  /**
   * The $(ref:tabs.Tab) which opened the connection, if any. This property will **only** be present when the connection was opened from a tab (including content scripts), and **only** if the receiver is an extension, not an app.
  */
    tab?:  tabs.Tab
  /**
   * The $(topic:frame_ids)[frame] that opened the connection. 0 for top-level frames, positive for child frames. This will only be set when `tab` is set.
  */
    frameId?: number
  /**
   * The ID of the extension or app that opened the connection, if any.
  */
    id?: string
  /**
   * The URL of the page or frame that opened the connection. If the sender is in an iframe, it will be iframe's URL not the URL of the page which hosts it.
  */
    url?: string

  }

  /**
 * The operating system the browser is running on.
  */
  /**
 * The operating system the browser is running on.
  */
  type PlatformOs = string;
  /**
 * The machine's processor architecture.
  */
  /**
 * The machine's processor architecture.
  */
  type PlatformArch = string;
  /**
 * An object containing information about the current platform.
  */
  export interface PlatformInfo {
  /**
   * The operating system the browser is running on.
  */
    os: PlatformOs
  /**
   * The machine's processor architecture.
  */
    arch: PlatformArch

  }

  /**
 * An object containing information about the current browser.
  */
  export interface BrowserInfo {
  /**
   * The name of the browser, for example 'Firefox'.
  */
    name: string
  /**
   * The name of the browser vendor, for example 'Mozilla'.
  */
    vendor: string
  /**
   * The browser's version, for example '42.0.0' or '0.8.1pre'.
  */
    version: string
  /**
   * The browser's build ID/date, for example '20160101'.
  */
    buildID: string

  }

  /**
 * Result of the update check.
  */
  /**
 * Result of the update check.
  */
  type RequestUpdateCheckStatus = string;
  /**
 * The reason that this event is being dispatched.
  */
  /**
 * The reason that this event is being dispatched.
  */
  type OnInstalledReason = string;
  /**
 * The reason that the event is being dispatched. 'app_update' is used when the restart is needed because the application is updated to a newer version. 'os_update' is used when the restart is needed because the browser/OS is updated to a newer version. 'periodic' is used when the system runs for more than the permitted uptime set in the enterprise policy.
  */
  /**
 * The reason that the event is being dispatched. 'app_update' is used when the restart is needed because the application is updated to a newer version. 'os_update' is used when the restart is needed because the browser/OS is updated to a newer version. 'periodic' is used when the system runs for more than the permitted uptime set in the enterprise policy.
  */
  type OnRestartRequiredReason = string;
  /**
 * The performance warning event category, e.g. 'content_script'.
  */
  /**
 * The performance warning event category, e.g. 'content_script'.
  */
  type OnPerformanceWarningCategory = string;
  /**
 * The performance warning event severity. Will be 'high' for serious and user-visible issues.
  */
  /**
 * The performance warning event severity. Will be 'high' for serious and user-visible issues.
  */
  type OnPerformanceWarningSeverity = string;
  /**
 * Retrieves the JavaScript 'window' object for the background page running inside the current extension/app. If the background page is an event page, the system will ensure it is loaded before calling the callback. If there is no background page, an error is set.
  */
  function getBackgroundPage(): Promise</* "unknown" undefined */ object>;
  /**
 * Fetches information about active contexts associated with this extension
  */
  function getContexts(/**
 * A filter to find matching context.
  */

filter: ContextFilter): Promise<ExtensionContext[]>;
  /**
 * <p>Open your Extension's options page, if possible.</p><p>The precise behavior may depend on your manifest's `$(topic:optionsV2)[options_ui]` or `$(topic:options)[options_page]` key, or what the browser happens to support at the time.</p><p>If your Extension does not declare an options page, or the browser failed to create one for some other reason, the callback will set $(ref:lastError).</p>
  */
  function openOptionsPage(): Promise<void | null>;
  /**
 * Returns details about the app or extension from the manifest. The object returned is a serialization of the full $(topic:manifest)[manifest file].
  */
  function getManifest(): object;
  /**
 * Converts a relative path within an app/extension install directory to a fully-qualified URL.
  */
  function getURL(/**
 * A path to a resource within an app/extension expressed relative to its install directory.
  */

path: string): string;
  /**
 * Get the frameId of any window global or frame element.
  */
  function getFrameId(/**
 * A WindowProxy or a Browsing Context container element (IFrame, Frame, Embed, Object) for the target frame.
  */

target: any): number;
  /**
 * Sets the URL to be visited upon uninstallation. This may be used to clean up server-side data, do analytics, and implement surveys. Maximum 1023 characters.
  */
  function setUninstallURL(/**
 * URL to be opened after the extension is uninstalled. This URL must have an http: or https: scheme. Set an empty string to not open a new tab upon uninstallation.
  */

url?: string): Promise<void | null>;
  /**
 * Reloads the app or extension.
  */
  function reload(): void;
  /**
 * Requests an update check for this app/extension.
  */
  function requestUpdateCheck(): Promise<RequestUpdateCheckStatus>;
  /**
 * Restart the device when the app runs in kiosk mode. Otherwise, it's no-op.
  */
  function restart(): void;
  /**
 * Attempts to connect to connect listeners within an extension/app (such as the background page), or other extensions/apps. This is useful for content scripts connecting to their extension processes, inter-app/extension communication, and $(topic:manifest/externally_connectable)[web messaging]. Note that this does not connect to any listeners in a content script. Extensions may connect to content scripts embedded in tabs via $(ref:tabs.connect).
  */
  function connect(/**
 * The ID of the extension or app to connect to. If omitted, a connection will be attempted with your own extension. Required if sending messages from a web page for $(topic:manifest/externally_connectable)[web messaging].
  */

extensionId?: string, connectInfo?: {
    /**
   * Will be passed into onConnect for processes that are listening for the connection event.
  */
    name?: string
  /**
   * Whether the TLS channel ID will be passed into onConnectExternal for processes that are listening for the connection event.
  */
    includeTlsChannelId?: boolean

  }): undefined;
  /**
 * Connects to a native application in the host machine.
  */
  function connectNative(/**
 * The name of the registered application to connect to.
  */

application: string): undefined;
  /**
 * Sends a single message to event listeners within your extension/app or a different extension/app. Similar to $(ref:runtime.connect) but only sends a single message, with an optional response. If sending to your extension, the $(ref:runtime.onMessage) event will be fired in each page, or $(ref:runtime.onMessageExternal), if a different extension. Note that extensions cannot send messages to content scripts using this method. To send messages to content scripts, use $(ref:tabs.sendMessage).
  */
  function sendMessage(/**
 * The ID of the extension/app to send the message to. If omitted, the message will be sent to your own extension/app. Required if sending messages from a web page for $(topic:manifest/externally_connectable)[web messaging].
  */

extensionId: string, message: any, options: {
  
  }): Promise<any>;
  function sendMessage(message: any, options: {
  
  }): Promise<any>;
  function sendMessage(message: any): Promise<any>;
  /**
 * Send a single message to a native application.
  */
  function sendNativeMessage(/**
 * The name of the native messaging host.
  */

application: string, /**
 * The message that will be passed to the native messaging host.
  */

message: any): Promise<any>;
  /**
 * Returns information about the current browser.
  */
  function getBrowserInfo(): Promise<BrowserInfo>;
  /**
 * Returns information about the current platform.
  */
  function getPlatformInfo(): Promise<PlatformInfo>;
  /**
 * Returns a DirectoryEntry for the package directory.
  */
  function getPackageDirectoryEntry(): Promise</* "unknown" undefined */ object>;
    const onStartup: EventHandler<  /**
 * Fired when a profile that has this extension installed first starts up. This event is not fired for incognito profiles.
  */
  (() => void)>;
    const onInstalled: EventHandler<  /**
 * Fired when the extension is first installed, when the extension is updated to a new version, and when the browser is updated to a new version.
  */
  ((details: {
    /**
   * The reason that this event is being dispatched.
  */
    reason: OnInstalledReason
  /**
   * Indicates the previous version of the extension, which has just been updated. This is present only if 'reason' is 'update'.
  */
    previousVersion?: string
  /**
   * Indicates whether the addon is installed as a temporary extension.
  */
    temporary: boolean

  }) => void)>;
    const onSuspend: EventHandler<  /**
 * Sent to the event page just before it is unloaded. This gives the extension opportunity to do some clean up. Note that since the page is unloading, any asynchronous operations started while handling this event are not guaranteed to complete. If more activity for the event page occurs before it gets unloaded the onSuspendCanceled event will be sent and the page won't be unloaded. 
  */
  (() => void)>;
    const onSuspendCanceled: EventHandler<  /**
 * Sent after onSuspend to indicate that the app won't be unloaded after all.
  */
  (() => void)>;
    const onUpdateAvailable: EventHandler<  /**
 * Fired when an update is available, but isn't installed immediately because the app is currently running. If you do nothing, the update will be installed the next time the background page gets unloaded, if you want it to be installed sooner you can explicitly call $(ref:runtime.reload). If your extension is using a persistent background page, the background page of course never gets unloaded, so unless you call $(ref:runtime.reload) manually in response to this event the update will not get installed until the next time the browser itself restarts. If no handlers are listening for this event, and your extension has a persistent background page, it behaves as if $(ref:runtime.reload) is called in response to this event.
  */
  ((/**
 * The manifest details of the available update.
  */

details: {
    /**
   * The version number of the available update.
  */
    version: string

  }) => void)>;
    const onBrowserUpdateAvailable: EventHandler<  /**
 * Fired when an update for the browser is available, but isn't installed immediately because a browser restart is required.
  */
  (() => void)>;
    const onConnect: EventHandler<  /**
 * Fired when a connection is made from either an extension process or a content script.
  */
  ((port: Port) => void)>;
    const onConnectExternal: EventHandler<  /**
 * Fired when a connection is made from another extension.
  */
  ((port: Port) => void)>;
    const onMessage: EventHandler<  /**
 * Fired when a message is sent from either an extension process or a content script.
  */
  ((/**
 * The message sent by the calling script.
  */

message: any, sender: MessageSender, /**
 * Function to call (at most once) when you have a response. The argument should be any JSON-ifiable object. If you have more than one `onMessage` listener in the same document, then only one may send a response. This function becomes invalid when the event listener returns, unless you return true from the event listener to indicate you wish to send a response asynchronously (this will keep the message channel open to the other end until `sendResponse` is called).
  */

sendResponse: /* or any?  */   () => void , 
 /* x7 */) => boolean) | 
  ((sender: MessageSender, /**
 * Function to call (at most once) when you have a response. The argument should be any JSON-ifiable object. If you have more than one `onMessage` listener in the same document, then only one may send a response. This function becomes invalid when the event listener returns, unless you return true from the event listener to indicate you wish to send a response asynchronously (this will keep the message channel open to the other end until `sendResponse` is called).
  */

sendResponse: /* or any?  */   () => void , 
 /* x7 */) => boolean)>;
    const onMessageExternal: EventHandler<  /**
 * Fired when a message is sent from another extension/app. Cannot be used in a content script.
  */
  ((/**
 * The message sent by the calling script.
  */

message: any, sender: MessageSender, /**
 * Function to call (at most once) when you have a response. The argument should be any JSON-ifiable object. If you have more than one `onMessage` listener in the same document, then only one may send a response. This function becomes invalid when the event listener returns, unless you return true from the event listener to indicate you wish to send a response asynchronously (this will keep the message channel open to the other end until `sendResponse` is called).
  */

sendResponse: /* or any?  */   () => void , 
 /* x7 */) => boolean) | 
  ((sender: MessageSender, /**
 * Function to call (at most once) when you have a response. The argument should be any JSON-ifiable object. If you have more than one `onMessage` listener in the same document, then only one may send a response. This function becomes invalid when the event listener returns, unless you return true from the event listener to indicate you wish to send a response asynchronously (this will keep the message channel open to the other end until `sendResponse` is called).
  */

sendResponse: /* or any?  */   () => void , 
 /* x7 */) => boolean)>;
    const onRestartRequired: EventHandler<  /**
 * Fired when an app or the device that it runs on needs to be restarted. The app should close all its windows at its earliest convenient time to let the restart to happen. If the app does nothing, a restart will be enforced after a 24-hour grace period has passed. Currently, this event is only fired for Chrome OS kiosk apps.
  */
  ((/**
 * The reason that the event is being dispatched.
  */

reason: OnRestartRequiredReason) => void)>;
    const onPerformanceWarning: EventHandler<  /**
 * Fired when a runtime performance issue is detected with the extension. Observe this event to be proactively notified of runtime performance problems with the extension.
  */
  ((details: {
    /**
   * The performance warning event category, e.g. 'content_script'.
  */
    category: OnPerformanceWarningCategory
  /**
   * The performance warning event severity, e.g. 'high'.
  */
    severity: OnPerformanceWarningSeverity
  /**
   * The $(ref:tabs.Tab) that the performance warning relates to, if any.
  */
    tabId?: number
  /**
   * An explanation of what the warning means, and hopefully how to address it.
  */
    description: string

  }) => void)>;
  /**
 * This will be defined during an API method callback if there was an error
  */
  /**
 * The ID of the extension/app.
  */
}

  /**
 * Use the `browser.contextualIdentities` API to query and modify contextual identity, also called as containers.
  */
declare namespace browser.contextualIdentities {
  /**
 * Represents information about a contextual identity.
  */
  export interface ContextualIdentity {
  /**
   * The name of the contextual identity.
  */
    name: string
  /**
   * The icon name of the contextual identity.
  */
    icon: string
  /**
   * The icon url of the contextual identity.
  */
    iconUrl: string
  /**
   * The color name of the contextual identity.
  */
    color: string
  /**
   * The color hash of the contextual identity.
  */
    colorCode: string
  /**
   * The cookie store ID of the contextual identity.
  */
    cookieStoreId: string

  }

  /**
 * Retrieves information about a single contextual identity.
  */
  function get(/**
 * The ID of the contextual identity cookie store. 
  */

cookieStoreId: string): Promise<any>;
  /**
 * Retrieves all contextual identities
  */
  function query(/**
 * Information to filter the contextual identities being retrieved.
  */

details: {
    /**
   * Filters the contextual identity by name.
  */
    name?: string

  }): Promise<any>;
  /**
 * Creates a contextual identity with the given data.
  */
  function create(/**
 * Details about the contextual identity being created.
  */

details: {
    /**
   * The name of the contextual identity.
  */
    name: string
  /**
   * The color of the contextual identity.
  */
    color: string
  /**
   * The icon of the contextual identity.
  */
    icon: string

  }): Promise<any>;
  /**
 * Updates a contextual identity with the given data.
  */
  function update(/**
 * The ID of the contextual identity cookie store. 
  */

cookieStoreId: string, /**
 * Details about the contextual identity being created.
  */

details: {
    /**
   * The name of the contextual identity.
  */
    name?: string
  /**
   * The color of the contextual identity.
  */
    color?: string
  /**
   * The icon of the contextual identity.
  */
    icon?: string

  }): Promise<any>;
  /**
 * Reorder one or more contextual identities by their cookieStoreIDs to a given position.
  */
  function move(/**
 * The ID or list of IDs of the contextual identity cookie stores. 
  */

cookieStoreIds: string | string[], /**
 * The position the contextual identity should move to.
  */

position: number): Promise<any>;
  /**
 * Deletes a contextual identity by its cookie Store ID.
  */
  function remove(/**
 * The ID of the contextual identity cookie store. 
  */

cookieStoreId: string): Promise<any>;
    const onUpdated: EventHandler<  /**
 * Fired when a container is updated.
  */
  ((changeInfo: {
    /**
   * Contextual identity that has been updated
  */
    contextualIdentity: ContextualIdentity

  }) => void)>;
    const onCreated: EventHandler<  /**
 * Fired when a new container is created.
  */
  ((changeInfo: {
    /**
   * Contextual identity that has been created
  */
    contextualIdentity: ContextualIdentity

  }) => void)>;
    const onRemoved: EventHandler<  /**
 * Fired when a container is removed.
  */
  ((changeInfo: {
    /**
   * Contextual identity that has been removed
  */
    contextualIdentity: ContextualIdentity

  }) => void)>;
}

  /**
 * The `chrome.events` namespace contains common types used by APIs dispatching events to notify you when something interesting happens.
  */
declare namespace browser.events {
  /**
 * Description of a declarative rule for handling events.
  */
  export interface Rule {
  /**
   * Optional identifier that allows referencing this rule.
  */
    id?: string
  /**
   * Tags can be used to annotate rules and perform operations on sets of rules.
  */
    tags?: string[]
  /**
   * List of conditions that can trigger the actions.
  */
    conditions: any[]
  /**
   * List of actions that are triggered if one of the condtions is fulfilled.
  */
    actions: any[]
  /**
   * Optional priority of this rule. Defaults to 100.
  */
    priority?: number

  }

  /**
 * An object which allows the addition and removal of listeners for a Chrome event.
  */
  export interface Event {
  /**
 * Registers an event listener *callback* to an event.
  */

  addListener(): void;

  /**
 * Deregisters an event listener *callback* from an event.
  */

  removeListener(): void;


  hasListener(): boolean;


  hasListeners(): boolean;

  /**
 * Registers rules to handle events.
  */

  addRules(/**
 * Name of the event this function affects.
  */

eventName: string, /**
 * If provided, this is an integer that uniquely identfies the <webview> associated with this function call.
  */

webViewInstanceId: number, /**
 * Rules to be registered. These do not replace previously registered rules.
  */

rules: Rule[]): void;

  /**
 * Returns currently registered rules.
  */

  getRules(/**
 * Name of the event this function affects.
  */

eventName: string, /**
 * If provided, this is an integer that uniquely identfies the <webview> associated with this function call.
  */

webViewInstanceId: number, /**
 * If an array is passed, only rules with identifiers contained in this array are returned.
  */

ruleIdentifiers?: string[]): void;

  /**
 * Unregisters currently registered rules.
  */

  removeRules(/**
 * Name of the event this function affects.
  */

eventName: string, /**
 * If provided, this is an integer that uniquely identfies the <webview> associated with this function call.
  */

webViewInstanceId: number, /**
 * If an array is passed, only rules with identifiers contained in this array are unregistered.
  */

ruleIdentifiers?: string[]): void;


  }

  /**
 * Filters URLs for various criteria. See <a href='events#filtered'>event filtering</a>. All criteria are case sensitive.
  */
  export interface UrlFilter {
  /**
   * Matches if the host name of the URL contains a specified string. To test whether a host name component has a prefix 'foo', use hostContains: '.foo'. This matches 'www.foobar.com' and 'foo.com', because an implicit dot is added at the beginning of the host name. Similarly, hostContains can be used to match against component suffix ('foo.') and to exactly match against components ('.foo.'). Suffix- and exact-matching for the last components need to be done separately using hostSuffix, because no implicit dot is added at the end of the host name.
  */
    hostContains?: string
  /**
   * Matches if the host name of the URL is equal to a specified string.
  */
    hostEquals?: string
  /**
   * Matches if the host name of the URL starts with a specified string.
  */
    hostPrefix?: string
  /**
   * Matches if the host name of the URL ends with a specified string.
  */
    hostSuffix?: string
  /**
   * Matches if the path segment of the URL contains a specified string.
  */
    pathContains?: string
  /**
   * Matches if the path segment of the URL is equal to a specified string.
  */
    pathEquals?: string
  /**
   * Matches if the path segment of the URL starts with a specified string.
  */
    pathPrefix?: string
  /**
   * Matches if the path segment of the URL ends with a specified string.
  */
    pathSuffix?: string
  /**
   * Matches if the query segment of the URL contains a specified string.
  */
    queryContains?: string
  /**
   * Matches if the query segment of the URL is equal to a specified string.
  */
    queryEquals?: string
  /**
   * Matches if the query segment of the URL starts with a specified string.
  */
    queryPrefix?: string
  /**
   * Matches if the query segment of the URL ends with a specified string.
  */
    querySuffix?: string
  /**
   * Matches if the URL (without fragment identifier) contains a specified string. Port numbers are stripped from the URL if they match the default port number.
  */
    urlContains?: string
  /**
   * Matches if the URL (without fragment identifier) is equal to a specified string. Port numbers are stripped from the URL if they match the default port number.
  */
    urlEquals?: string
  /**
   * Matches if the URL (without fragment identifier) matches a specified regular expression. Port numbers are stripped from the URL if they match the default port number. The regular expressions use the <a href="https://github.com/google/re2/blob/master/doc/syntax.txt">RE2 syntax</a>.
  */
    urlMatches?: string
  /**
   * Matches if the URL without query segment and fragment identifier matches a specified regular expression. Port numbers are stripped from the URL if they match the default port number. The regular expressions use the <a href="https://github.com/google/re2/blob/master/doc/syntax.txt">RE2 syntax</a>.
  */
    originAndPathMatches?: string
  /**
   * Matches if the URL (without fragment identifier) starts with a specified string. Port numbers are stripped from the URL if they match the default port number.
  */
    urlPrefix?: string
  /**
   * Matches if the URL (without fragment identifier) ends with a specified string. Port numbers are stripped from the URL if they match the default port number.
  */
    urlSuffix?: string
  /**
   * Matches if the scheme of the URL is equal to any of the schemes specified in the array.
  */
    schemes?: string[]
  /**
   * Matches if the port of the URL is contained in any of the specified port lists. For example `[80, 443, [1000, 1200]]` matches all requests on port 80, 443 and in the range 1000-1200.
  */
    ports?: []

  }

}

  /**
 * Contains types used by other schemas.
  */
declare namespace browser.types {
  /**
 * The scope of the Setting. One of<ul><li><var>regular</var>: setting for the regular profile (which is inherited by the incognito profile if not overridden elsewhere),</li><li><var>regular_only</var>: setting for the regular profile only (not inherited by the incognito profile),</li><li><var>incognito_persistent</var>: setting for the incognito profile that survives browser restarts (overrides regular preferences),</li><li><var>incognito_session_only</var>: setting for the incognito profile that can only be set during an incognito session and is deleted when the incognito session ends (overrides regular and incognito_persistent preferences).</li></ul> Only <var>regular</var> is supported by Firefox at this time.
  */
  /**
 * The scope of the Setting. One of<ul><li><var>regular</var>: setting for the regular profile (which is inherited by the incognito profile if not overridden elsewhere),</li><li><var>regular_only</var>: setting for the regular profile only (not inherited by the incognito profile),</li><li><var>incognito_persistent</var>: setting for the incognito profile that survives browser restarts (overrides regular preferences),</li><li><var>incognito_session_only</var>: setting for the incognito profile that can only be set during an incognito session and is deleted when the incognito session ends (overrides regular and incognito_persistent preferences).</li></ul> Only <var>regular</var> is supported by Firefox at this time.
  */
  type SettingScope = string;
  /**
 * One of<ul><li><var>not_controllable</var>: cannot be controlled by any extension</li><li><var>controlled_by_other_extensions</var>: controlled by extensions with higher precedence</li><li><var>controllable_by_this_extension</var>: can be controlled by this extension</li><li><var>controlled_by_this_extension</var>: controlled by this extension</li></ul>
  */
  /**
 * One of<ul><li><var>not_controllable</var>: cannot be controlled by any extension</li><li><var>controlled_by_other_extensions</var>: controlled by extensions with higher precedence</li><li><var>controllable_by_this_extension</var>: can be controlled by this extension</li><li><var>controlled_by_this_extension</var>: controlled by this extension</li></ul>
  */
  type LevelOfControl = string;
  export interface Setting {
  /**
 * Gets the value of a setting.
  */

  get(/**
 * Which setting to consider.
  */

details: {
    /**
   * Whether to return the value that applies to the incognito session (default false).
  */
    incognito?: boolean

  }): Promise<{
    /**
   * The value of the setting.
  */
    value: any
  /**
   * The level of control of the setting.
  */
    levelOfControl:  types.LevelOfControl
  /**
   * Whether the effective value is specific to the incognito session.<br/>This property will *only* be present if the <var>incognito</var> property in the <var>details</var> parameter of `get()` was true.
  */
    incognitoSpecific?: boolean

  }>;

  /**
 * Sets the value of a setting.
  */

  set(/**
 * Which setting to change.
  */

details: {
    /**
   * The value of the setting. <br/>Note that every setting has a specific value type, which is described together with the setting. An extension should *not* set a value of a different type.
  */
    value: any
  /**
   * Where to set the setting (default: regular).
  */
    scope?:  types.SettingScope

  }): Promise<void | null>;

  /**
 * Clears the setting, restoring any default value.
  */

  clear(/**
 * Which setting to clear.
  */

details: {
    /**
   * Where to clear the setting (default: regular).
  */
    scope?:  types.SettingScope

  }): Promise<void | null>;


  }

}

  /**
 * This API provides the ability to determine the status of and detect changes in the network connection. This API can only be used in privileged extensions.
  */
declare namespace browser.networkStatus {
  export interface NetworkLinkInfo {
  /**
   * Status of the network link, if "unknown" then link is usually assumed to be "up"
  */
    status: 'unknown'
 | 'up'
 | 'down'
  /**
   * If known, the type of network connection that is avialable.
  */
    type: 'unknown'
 | 'ethernet'
 | 'usb'
 | 'wifi'
 | 'wimax'
 | 'mobile'
  /**
   * If known, the network id or name.
  */
    id?: string

  }

  /**
 * Returns the $(ref:NetworkLinkInfo} of the current network connection.
  */
  function getLinkInfo(): Promise<any>;
    const onConnectionChanged: EventHandler<  /**
 * Fired when the network connection state changes.
  */
  ((details: NetworkLinkInfo) => void)>;
}

  /**
 * Provides access to global proxy settings for Firefox and proxy event listeners to handle dynamic proxy implementations.
  */
declare namespace browser.proxy {
  /**
 * An object which describes proxy settings.
  */
  export interface ProxyConfig {
  /**
   * The type of proxy to use.
  */
    proxyType?: 'none'
 | 'autoDetect'
 | 'system'
 | 'manual'
 | 'autoConfig'
  /**
   * The address of the http proxy, can include a port.
  */
    http?: string
  /**
   * Use the http proxy server for all protocols.
  */
    httpProxyAll?: boolean
  /**
   * The address of the ftp proxy, can include a port.  Deprecated since Firefox 88.
  */
    ftp?: string
  /**
   * The address of the ssl proxy, can include a port.
  */
    ssl?: string
  /**
   * The address of the socks proxy, can include a port.
  */
    socks?: string
  /**
   * The version of the socks proxy.
  */
    socksVersion?: number
  /**
   * A list of hosts which should not be proxied.
  */
    passthrough?: string
  /**
   * A URL to use to configure the proxy.
  */
    autoConfigUrl?: string
  /**
   * Do not prompt for authentication if password is saved.
  */
    autoLogin?: boolean
  /**
   * Proxy DNS when using SOCKS. DNS queries get leaked to the network when set to false. True by default for SOCKS v5. False by default for SOCKS v4.
  */
    proxyDNS?: boolean
  /**
   *  If true (the default value), do not use newer TLS protocol features that might have interoperability problems on the Internet. This is intended only for use with critical infrastructure like the updates, and is only available to privileged addons.
  */
    respectBeConservative?: boolean

  }

    const onRequest: EventHandler<  /**
 * Fired when proxy data is needed for a request.
  */
  ((details: {
    /**
   * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
  */
    requestId: string
    url: string
  /**
   * Standard HTTP method.
  */
    method: string
  /**
   * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
  */
    frameId: number
  /**
   * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
  */
    parentFrameId: number
  /**
   * True for private browsing requests.
  */
    incognito?: boolean
  /**
   * The cookie store ID of the contextual identity.
  */
    cookieStoreId?: string
  /**
   * URL of the resource that triggered this request.
  */
    originUrl?: string
  /**
   * URL of the page into which the requested resource will be loaded.
  */
    documentUrl?: string
  /**
   * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
  */
    tabId: number
  /**
   * How the requested resource will be used.
  */
    type:  webRequest.ResourceType
  /**
   * The time when this signal is triggered, in milliseconds since the epoch.
  */
    timeStamp: number
  /**
   * Indicates if this response was fetched from disk cache.
  */
    fromCache: boolean
  /**
   * The HTTP request headers that are going to be sent out with this request.
  */
    requestHeaders?:  webRequest.HttpHeaders
  /**
   * Url classification if the request has been classified.
  */
    urlClassification:  webRequest.UrlClassification
  /**
   * Indicates if this request and its content window hierarchy is third party.
  */
    thirdParty: boolean

  }) => void)>;
    const onError: EventHandler<  /**
 * Notifies about errors caused by the invalid use of the proxy API.
  */
  ((error: /* "unknown" undefined */ object) => void)>;
  /**
 * Configures proxy settings. This setting's value is an object of type ProxyConfig.
  */
const settings:  types.Setting;
}

  /**
 * Use the `browser.i18n` infrastructure to implement internationalization across your whole app or extension.
  */
declare namespace browser.i18n {
  /**
 * An ISO language code such as `en` or `fr`. For a complete list of languages supported by this method, see <a href='http://src.chromium.org/viewvc/chrome/trunk/src/third_party/cld/languages/internal/languages.cc'>kLanguageInfoTable</a>. For an unknown language, `und` will be returned, which means that [percentage] of the text is unknown to CLD
  */
  /**
 * An ISO language code such as `en` or `fr`. For a complete list of languages supported by this method, see <a href='http://src.chromium.org/viewvc/chrome/trunk/src/third_party/cld/languages/internal/languages.cc'>kLanguageInfoTable</a>. For an unknown language, `und` will be returned, which means that [percentage] of the text is unknown to CLD
  */
  type LanguageCode = string;
  /**
 * Gets the accept-languages of the browser. This is different from the locale used by the browser; to get the locale, use $(ref:i18n.getUILanguage).
  */
  function getAcceptLanguages(): Promise<LanguageCode[]>;
  /**
 * Gets the localized string for the specified message. If the message is missing, this method returns an empty string (''). If the format of the `getMessage()` call is wrong &mdash; for example, *messageName* is not a string or the *substitutions* array has more than 9 elements &mdash; this method returns `undefined`.
  */
  function getMessage(/**
 * The name of the message, as specified in the `$(topic:i18n-messages)[messages.json]` file.
  */

messageName: string, /**
 * Substitution strings, if the message requires any.
  */

substitutions?: any): string;
  /**
 * Gets the browser UI language of the browser. This is different from $(ref:i18n.getAcceptLanguages) which returns the preferred user languages.
  */
  function getUILanguage(): string;
  /**
 * Detects the language of the provided text using CLD.
  */
  function detectLanguage(/**
 * User input string to be translated.
  */

text: string): Promise<{
    /**
   * CLD detected language reliability
  */
    isReliable: boolean
  /**
   * array of detectedLanguage
  */
    languages: {
      language: LanguageCode
  /**
   * The percentage of the detected language
  */
    percentage: number

  }[]

  }>;
}

  /**
 * Asynchronous DNS API
  */
declare namespace browser.dns {
  /**
 * An object encapsulating a DNS Record.
  */
  export interface DNSRecord {
  /**
   * The canonical hostname for this record.  this value is empty if the record was not fetched with the 'canonical_name' flag.
  */
    canonicalName?: string
  /**
   * Record retreived with TRR.
  */
    isTRR: string
    addresses: string[]

  }

  type ResolveFlags = 'allow_name_collisions'
 | 'bypass_cache'
 | 'canonical_name'
 | 'disable_ipv4'
 | 'disable_ipv6'
 | 'disable_trr'
 | 'offline'
 | 'priority_low'
 | 'priority_medium'
 | 'speculate'[];
  /**
 * Resolves a hostname to a DNS record.
  */
  function resolve(hostname: string, flags?: ResolveFlags): Promise<any>;
}

  /**
 * Use the declarativeNetRequest API to block or modify network requests by specifying declarative rules.
  */
declare namespace browser.declarativeNetRequest {
  /**
 * How the requested resource will be used. Comparable to the webRequest.ResourceType type.
  */
  /**
 * How the requested resource will be used. Comparable to the webRequest.ResourceType type.
  */
  type ResourceType = string;
  /**
 * Describes the reason why a given regular expression isn't supported.
  */
  /**
 * Describes the reason why a given regular expression isn't supported.
  */
  type UnsupportedRegexReason = string;
  export interface MatchedRule {
  /**
   * A matching rule's ID.
  */
    ruleId: number
  /**
   * ID of the Ruleset this rule belongs to.
  */
    rulesetId: string
  /**
   * ID of the extension, if this rule belongs to a different extension.
  */
    extensionId?: string

  }

  /**
 * Describes the type of the Rule.action.redirect.transform property.
  */
  export interface URLTransform {
  /**
   * The new scheme for the request.
  */
    scheme?: 'http'
 | 'https'
 | 'moz-extension'
  /**
   * The new username for the request.
  */
    username?: string
  /**
   * The new password for the request.
  */
    password?: string
  /**
   * The new host name for the request.
  */
    host?: string
  /**
   * The new port for the request. If empty, the existing port is cleared.
  */
    port?: string
  /**
   * The new path for the request. If empty, the existing path is cleared.
  */
    path?: string
  /**
   * The new query for the request. Should be either empty, in which case the existing query is cleared; or should begin with '?'. Cannot be specified if 'queryTransform' is specified.
  */
    query?: string
  /**
   * Add, remove or replace query key-value pairs. Cannot be specified if 'query' is specified.
  */
    queryTransform?: {
    /**
   * The list of query keys to be removed.
  */
    removeParams?: string[]
  /**
   * The list of query key-value pairs to be added or replaced.
  */
    addOrReplaceParams?: {
      key: string
    value: string
  /**
   * If true, the query key is replaced only if it's already present. Otherwise, the key is also added if it's missing.
  */
    replaceOnly?: boolean

  }[]

  }
  /**
   * The new fragment for the request. Should be either empty, in which case the existing fragment is cleared; or should begin with '#'.
  */
    fragment?: string

  }

  export interface Rule {
  /**
   * An id which uniquely identifies a rule. Mandatory and should be >= 1.
  */
    id: number
  /**
   * Rule priority. Defaults to 1. When specified, should be >= 1
  */
    priority?: number
  /**
   * The condition under which this rule is triggered.
  */
    condition: {
    /**
   * TODO: link to doc explaining supported pattern. The pattern which is matched against the network request url. Only one of 'urlFilter' or 'regexFilter' can be specified.
  */
    urlFilter?: string
  /**
   * Regular expression to match against the network request url. Only one of 'urlFilter' or 'regexFilter' can be specified.
  */
    regexFilter?: string
  /**
   * Whether 'urlFilter' or 'regexFilter' is case-sensitive.
  */
    isUrlFilterCaseSensitive?: boolean
  /**
   * The rule will only match network requests originating from the list of 'initiatorDomains'. If the list is omitted, the rule is applied to requests from all domains.
  */
    initiatorDomains?: string[]
  /**
   * The rule will not match network requests originating from the list of 'initiatorDomains'. If the list is empty or omitted, no domains are excluded. This takes precedence over 'initiatorDomains'.
  */
    excludedInitiatorDomains?: string[]
  /**
   * The rule will only match network requests when the domain matches one from the list of 'requestDomains'. If the list is omitted, the rule is applied to requests from all domains.
  */
    requestDomains?: string[]
  /**
   * The rule will not match network requests when the domains matches one from the list of 'excludedRequestDomains'. If the list is empty or omitted, no domains are excluded. This takes precedence over 'requestDomains'.
  */
    excludedRequestDomains?: string[]
  /**
   * List of resource types which the rule can match. When the rule action is 'allowAllRequests', this must be specified and may only contain 'main_frame' or 'sub_frame'. Cannot be specified if 'excludedResourceTypes' is specified. If neither of them is specified, all resource types except 'main_frame' are matched.
  */
    resourceTypes?: ResourceType[]
  /**
   * List of resource types which the rule won't match. Cannot be specified if 'resourceTypes' is specified. If neither of them is specified, all resource types except 'main_frame' are matched.
  */
    excludedResourceTypes?: ResourceType[]
  /**
   * List of HTTP request methods which the rule can match. Should be a lower-case method such as 'connect', 'delete', 'get', 'head', 'options', 'patch', 'post', 'put'.'
  */
    requestMethods?: string[]
  /**
   * List of request methods which the rule won't match. Cannot be specified if 'requestMethods' is specified. If neither of them is specified, all request methods are matched.
  */
    excludedRequestMethods?: string[]
  /**
   * Specifies whether the network request is first-party or third-party to the domain from which it originated. If omitted, all requests are matched.
  */
    domainType?: 'firstParty'
 | 'thirdParty'
  /**
   * List of tabIds which the rule should match. An ID of -1 matches requests which don't originate from a tab. Only supported for session-scoped rules.
  */
    tabIds?: number[]
  /**
   * List of tabIds which the rule should not match. An ID of -1 excludes requests which don't originate from a tab. Only supported for session-scoped rules.
  */
    excludedTabIds?: number[]

  }
  /**
   * The action to take if this rule is matched.
  */
    action: {
      type: 'block'
 | 'redirect'
 | 'allow'
 | 'upgradeScheme'
 | 'modifyHeaders'
 | 'allowAllRequests'
  /**
   * Describes how the redirect should be performed. Only valid when type is 'redirect'.
  */
    redirect?: {
    /**
   * Path relative to the extension directory. Should start with '/'.
  */
    extensionPath?: string
  /**
   * Url transformations to perform.
  */
    transform?: URLTransform
  /**
   * The redirect url. Redirects to JavaScript urls are not allowed.
  */
    url?: string
  /**
   * Substitution pattern for rules which specify a 'regexFilter'. The first match of regexFilter within the url will be replaced with this pattern. Within regexSubstitution, backslash-escaped digits (\1 to \9) can be used to insert the corresponding capture groups. \0 refers to the entire matching text.
  */
    regexSubstitution?: string

  }
  /**
   * The request headers to modify for the request. Only valid when type is 'modifyHeaders'.
  */
    requestHeaders?: {
    /**
   * The name of the request header to be modified.
  */
    header: string
  /**
   * The operation to be performed on a header.
  */
    operation: 'append'
 | 'set'
 | 'remove'
  /**
   * The new value for the header. Must be specified for the 'append' and 'set' operations.
  */
    value?: string

  }[]
  /**
   * The response headers to modify for the request. Only valid when type is 'modifyHeaders'.
  */
    responseHeaders?: {
    /**
   * The name of the response header to be modified.
  */
    header: string
  /**
   * The operation to be performed on a header.
  */
    operation: 'append'
 | 'set'
 | 'remove'
  /**
   * The new value for the header. Must be specified for the 'append' and 'set' operations.
  */
    value?: string

  }[]

  }

  }

  export interface GetRulesFilter {
  /**
   * If specified, only rules with matching IDs are included.
  */
    ruleIds?: number[]

  }

  /**
 * Modifies the current set of dynamic rules for the extension. The rules with IDs listed in options.removeRuleIds are first removed, and then the rules given in options.addRules are added. These rules are persisted across browser sessions and extension updates.
  */
  function updateDynamicRules(options: {
    /**
   * IDs of the rules to remove. Any invalid IDs will be ignored.
  */
    removeRuleIds?: number[]
  /**
   * Rules to add.
  */
    addRules?: Rule[]

  }): Promise<void>;
  /**
 * Modifies the current set of session scoped rules for the extension. The rules with IDs listed in options.removeRuleIds are first removed, and then the rules given in options.addRules are added. These rules are not persisted across sessions and are backed in memory.
  */
  function updateSessionRules(options: {
    /**
   * IDs of the rules to remove. Any invalid IDs will be ignored.
  */
    removeRuleIds?: number[]
  /**
   * Rules to add.
  */
    addRules?: Rule[]

  }): Promise<void>;
  /**
 * Returns the ids for the current set of enabled static rulesets.
  */
  function getEnabledRulesets(): Promise<string[]>;
  /**
 * Modifies the static rulesets enabled/disabled state.
  */
  function updateEnabledRulesets(updateRulesetOptions: {
      disableRulesetIds?: string[]
    enableRulesetIds?: string[]

  }): Promise<void>;
  /**
 * Modified individual static rules enabled/disabled state. Changes to rules belonging to a disabled ruleset will take effect when the ruleset becomes enabled.
  */
  function updateStaticRules(options: {
      rulesetId: string
    disableRuleIds?: number[]
    enableRuleIds?: number[]

  }): Promise<void>;
  /**
 * Returns the remaining number of static rules an extension can enable
  */
  function getAvailableStaticRuleCount(): Promise<number>;
  /**
 * Returns the list of individual disabled static rules from a given static ruleset id.
  */
  function getDisabledRuleIds(options: {
      rulesetId: string

  }): Promise<number[]>;
  /**
 * Returns the current set of dynamic rules for the extension.
  */
  function getDynamicRules(/**
 * An object to filter the set of dynamic rules for the extension.
  */

filter?: GetRulesFilter): Promise<Rule[]>;
  /**
 * Returns the current set of session scoped rules for the extension.
  */
  function getSessionRules(/**
 * An object to filter the set of session scoped rules for the extension.
  */

filter?: GetRulesFilter): Promise<Rule[]>;
  /**
 * Checks if the given regular expression will be supported as a 'regexFilter' rule condition.
  */
  function isRegexSupported(regexOptions: {
    /**
   * The regular expresson to check.
  */
    regex: string
  /**
   * Whether the 'regex' specified is case sensitive.
  */
    isCaseSensitive?: boolean
  /**
   * Whether the 'regex' specified requires capturing. Capturing is only required for redirect rules which specify a 'regexSubstition' action.
  */
    requireCapturing?: boolean

  }): Promise<{
    /**
   * Whether the given regex is supported
  */
    isSupported: boolean
  /**
   * Specifies the reason why the regular expression is not supported. Only provided if 'isSupported' is false.
  */
    reason?: UnsupportedRegexReason

  }>;
  /**
 * Checks if any of the extension's declarativeNetRequest rules would match a hypothetical request.
  */
  function testMatchOutcome(/**
 * The details of the request to test.
  */

request: {
    /**
   * The URL of the hypothetical request.
  */
    url: string
  /**
   * The initiator URL (if any) for the hypothetical request.
  */
    initiator?: string
  /**
   * Standard HTTP method of the hypothetical request.
  */
    method?: string
  /**
   * The resource type of the hypothetical request.
  */
    type: ResourceType
  /**
   * The ID of the tab in which the hypothetical request takes place. Does not need to correspond to a real tab ID. Default is -1, meaning that the request isn't related to a tab.
  */
    tabId?: number

  }, options?: {
    /**
   * Whether to account for rules from other installed extensions during rule evaluation.
  */
    includeOtherExtensions?: boolean

  }): Promise<{
    /**
   * The rules (if any) that match the hypothetical request.
  */
    matchedRules: MatchedRule[]

  }>;
  /**
 * Ruleset ID for the dynamic rules added by the extension.
  */
const DYNAMIC_RULESET_ID = _dynamic;
  /**
 * The minimum number of static rules guaranteed to an extension across its enabled static rulesets. Any rules above this limit will count towards the global static rule limit.
  */
  /**
 * The maximum number of static Rulesets an extension can specify as part of the rule_resources manifest key.
  */
  /**
 * The maximum number of static rules that can be disabled on each static ruleset.
  */
  /**
 * The maximum number of static Rulesets an extension can enable at any one time.
  */
  /**
 * Deprecated property returning the maximum number of dynamic and session rules an extension can add, replaced by MAX_NUMBER_OF_DYNAMIC_RULES/MAX_NUMBER_OF_SESSION_RULES.
  */
  /**
 * The maximum number of dynamic session rules an extension can add.
  */
  /**
 * The maximum number of dynamic session rules an extension can add.
  */
  /**
 * The maximum number of regular expression rules that an extension can add. This limit is evaluated separately for the set of session rules, dynamic rules and those specified in the rule_resources file.
  */
  /**
 * Ruleset ID for the session-scoped rules added by the extension.
  */
const SESSION_RULESET_ID = _session;
}

  /**
 * The `browser.management` API provides ways to manage the list of extensions that are installed and running.
  */
declare namespace browser.management {
  /**
 * Information about an icon belonging to an extension.
  */
  export interface IconInfo {
  /**
   * A number representing the width and height of the icon. Likely values include (but are not limited to) 128, 48, 24, and 16.
  */
    size: number
  /**
   * The URL for this icon image. To display a grayscale version of the icon (to indicate that an extension is disabled, for example), append `?grayscale=true` to the URL.
  */
    url: string

  }

  /**
 * A reason the item is disabled.
  */
  /**
 * A reason the item is disabled.
  */
  type ExtensionDisabledReason = string;
  /**
 * The type of this extension, 'extension' or 'theme'.
  */
  /**
 * The type of this extension, 'extension' or 'theme'.
  */
  type ExtensionType = string;
  /**
 * How the extension was installed. One of<br><var>development</var>: The extension was loaded unpacked in developer mode,<br><var>normal</var>: The extension was installed normally via an .xpi file,<br><var>sideload</var>: The extension was installed by other software on the machine,<br><var>admin</var>: The extension was installed by policy,<br><var>other</var>: The extension was installed by other means.
  */
  /**
 * How the extension was installed. One of<br><var>development</var>: The extension was loaded unpacked in developer mode,<br><var>normal</var>: The extension was installed normally via an .xpi file,<br><var>sideload</var>: The extension was installed by other software on the machine,<br><var>admin</var>: The extension was installed by policy,<br><var>other</var>: The extension was installed by other means.
  */
  type ExtensionInstallType = string;
  /**
 * Information about an installed extension.
  */
  export interface ExtensionInfo {
  /**
   * The extension's unique identifier.
  */
    id: string
  /**
   * The name of this extension.
  */
    name: string
  /**
   * A short version of the name of this extension.
  */
    shortName?: string
  /**
   * The description of this extension.
  */
    description: string
  /**
   * The <a href='manifest/version'>version</a> of this extension.
  */
    version: string
  /**
   * The <a href='manifest/version#version_name'>version name</a> of this extension if the manifest specified one.
  */
    versionName?: string
  /**
   * Whether this extension can be disabled or uninstalled by the user.
  */
    mayDisable: boolean
  /**
   * Whether it is currently enabled or disabled.
  */
    enabled: boolean
  /**
   * A reason the item is disabled.
  */
    disabledReason?: ExtensionDisabledReason
  /**
   * The type of this extension, 'extension' or 'theme'.
  */
    type: ExtensionType
  /**
   * The URL of the homepage of this extension.
  */
    homepageUrl?: string
  /**
   * The update URL of this extension.
  */
    updateUrl?: string
  /**
   * The url for the item's options page, if it has one.
  */
    optionsUrl: string
  /**
   * A list of icon information. Note that this just reflects what was declared in the manifest, and the actual image at that url may be larger or smaller than what was declared, so you might consider using explicit width and height attributes on img tags referencing these images. See the <a href='manifest/icons'>manifest documentation on icons</a> for more details.
  */
    icons?: IconInfo[]
  /**
   * Returns a list of API based permissions.
  */
    permissions?: string[]
  /**
   * Returns a list of host based permissions.
  */
    hostPermissions?: string[]
  /**
   * How the extension was installed.
  */
    installType: ExtensionInstallType

  }

  /**
 * Returns a list of information about installed extensions.
  */
  function getAll(): Promise<ExtensionInfo[] | null>;
  /**
 * Returns information about the installed extension that has the given ID.
  */
  function get(/**
 * The ID from an item of $(ref:management.ExtensionInfo).
  */

id:  manifest.ExtensionID): Promise<ExtensionInfo | null>;
  /**
 * Installs and enables a theme extension from the given url.
  */
  function install(options: {
    /**
   * URL pointing to the XPI file on addons.mozilla.org or similar.
  */
    url:  manifest.HttpURL
  /**
   * A hash of the XPI file, using sha256 or stronger.
  */
    hash?: string

  }): Promise<{
      id:  manifest.ExtensionID

  } | null>;
  /**
 * Returns information about the calling extension. Note: This function can be used without requesting the 'management' permission in the manifest.
  */
  function getSelf(): Promise<ExtensionInfo | null>;
  /**
 * Uninstalls the calling extension. Note: This function can be used without requesting the 'management' permission in the manifest.
  */
  function uninstallSelf(options?: {
    /**
   * Whether or not a confirm-uninstall dialog should prompt the user. Defaults to false.
  */
    showConfirmDialog?: boolean
  /**
   * The message to display to a user when being asked to confirm removal of the extension.
  */
    dialogMessage?: string

  }): Promise<void | null>;
  /**
 * Enables or disables the given add-on.
  */
  function setEnabled(/**
 * ID of the add-on to enable/disable.
  */

id: string, /**
 * Whether to enable or disable the add-on.
  */

enabled: boolean): Promise<void | null>;
    const onDisabled: EventHandler<  /**
 * Fired when an addon has been disabled.
  */
  ((info: ExtensionInfo) => void)>;
    const onEnabled: EventHandler<  /**
 * Fired when an addon has been enabled.
  */
  ((info: ExtensionInfo) => void)>;
    const onInstalled: EventHandler<  /**
 * Fired when an addon has been installed.
  */
  ((info: ExtensionInfo) => void)>;
    const onUninstalled: EventHandler<  /**
 * Fired when an addon has been uninstalled.
  */
  ((info: ExtensionInfo) => void)>;
}

declare namespace browser.downloads {
  type FilenameConflictAction = string;
  type InterruptReason = string;
  /**
 * <dl><dt>file</dt><dd>The download's filename is suspicious.</dd><dt>url</dt><dd>The download's URL is known to be malicious.</dd><dt>content</dt><dd>The downloaded file is known to be malicious.</dd><dt>uncommon</dt><dd>The download's URL is not commonly downloaded and could be dangerous.</dd><dt>safe</dt><dd>The download presents no known danger to the user's computer.</dd></dl>These string constants will never change, however the set of DangerTypes may change.
  */
  /**
 * <dl><dt>file</dt><dd>The download's filename is suspicious.</dd><dt>url</dt><dd>The download's URL is known to be malicious.</dd><dt>content</dt><dd>The downloaded file is known to be malicious.</dd><dt>uncommon</dt><dd>The download's URL is not commonly downloaded and could be dangerous.</dd><dt>safe</dt><dd>The download presents no known danger to the user's computer.</dd></dl>These string constants will never change, however the set of DangerTypes may change.
  */
  type DangerType = string;
  /**
 * <dl><dt>in_progress</dt><dd>The download is currently receiving data from the server.</dd><dt>interrupted</dt><dd>An error broke the connection with the file host.</dd><dt>complete</dt><dd>The download completed successfully.</dd></dl>These string constants will never change, however the set of States may change.
  */
  /**
 * <dl><dt>in_progress</dt><dd>The download is currently receiving data from the server.</dd><dt>interrupted</dt><dd>An error broke the connection with the file host.</dd><dt>complete</dt><dd>The download completed successfully.</dd></dl>These string constants will never change, however the set of States may change.
  */
  type State = string;
  export interface DownloadItem {
  /**
   * An identifier that is persistent across browser sessions.
  */
    id: number
  /**
   * Absolute URL.
  */
    url: string
    referrer?: string
  /**
   * Absolute local path.
  */
    filename: string
  /**
   * False if this download is recorded in the history, true if it is not recorded.
  */
    incognito: boolean
  /**
   * The cookie store ID of the contextual identity.
  */
    cookieStoreId?: string
  /**
   * Indication of whether this download is thought to be safe or known to be suspicious.
  */
    danger: DangerType
  /**
   * The file's MIME type.
  */
    mime?: string
  /**
   * Number of milliseconds between the unix epoch and when this download began.
  */
    startTime: string
  /**
   * Number of milliseconds between the unix epoch and when this download ended.
  */
    endTime?: string
    estimatedEndTime?: string
  /**
   * Indicates whether the download is progressing, interrupted, or complete.
  */
    state: State
  /**
   * True if the download has stopped reading data from the host, but kept the connection open.
  */
    paused: boolean
    canResume: boolean
  /**
   * Number indicating why a download was interrupted.
  */
    error?: InterruptReason
  /**
   * Number of bytes received so far from the host, without considering file compression.
  */
    bytesReceived: number
  /**
   * Number of bytes in the whole file, without considering file compression, or -1 if unknown.
  */
    totalBytes: number
  /**
   * Number of bytes in the whole file post-decompression, or -1 if unknown.
  */
    fileSize: number
    exists: boolean
    byExtensionId?: string
    byExtensionName?: string

  }

  export interface StringDelta {
    current?: string
    previous?: string

  }

  export interface DoubleDelta {
    current?: number
    previous?: number

  }

  export interface BooleanDelta {
    current?: boolean
    previous?: boolean

  }

  /**
 * A time specified as a Date object, a number or string representing milliseconds since the epoch, or an ISO 8601 string
  */
  type DownloadTime = string |  extensionTypes.Date;
  /**
 * Parameters that combine to specify a predicate that can be used to select a set of downloads.  Used for example in search() and erase()
  */
  export interface DownloadQuery {
  /**
   * This array of search terms limits results to <a href='#type-DownloadItem'>DownloadItems</a> whose `filename` or `url` contain all of the search terms that do not begin with a dash '-' and none of the search terms that do begin with a dash.
  */
    query?: string[]
  /**
   * Limits results to downloads that started before the given ms since the epoch.
  */
    startedBefore?: DownloadTime
  /**
   * Limits results to downloads that started after the given ms since the epoch.
  */
    startedAfter?: DownloadTime
  /**
   * Limits results to downloads that ended before the given ms since the epoch.
  */
    endedBefore?: DownloadTime
  /**
   * Limits results to downloads that ended after the given ms since the epoch.
  */
    endedAfter?: DownloadTime
  /**
   * Limits results to downloads whose totalBytes is greater than the given integer.
  */
    totalBytesGreater?: number
  /**
   * Limits results to downloads whose totalBytes is less than the given integer.
  */
    totalBytesLess?: number
  /**
   * Limits results to <a href='#type-DownloadItem'>DownloadItems</a> whose `filename` matches the given regular expression.
  */
    filenameRegex?: string
  /**
   * Limits results to <a href='#type-DownloadItem'>DownloadItems</a> whose `url` matches the given regular expression.
  */
    urlRegex?: string
  /**
   * Setting this integer limits the number of results. Otherwise, all matching <a href='#type-DownloadItem'>DownloadItems</a> will be returned.
  */
    limit?: number
  /**
   * Setting elements of this array to <a href='#type-DownloadItem'>DownloadItem</a> properties in order to sort the search results. For example, setting `orderBy='startTime'` sorts the <a href='#type-DownloadItem'>DownloadItems</a> by their start time in ascending order. To specify descending order, prefix `orderBy` with a hyphen: '-startTime'.
  */
    orderBy?: string[]
    id?: number
  /**
   * Absolute URL.
  */
    url?: string
  /**
   * Absolute local path.
  */
    filename?: string
  /**
   * The cookie store ID of the contextual identity.
  */
    cookieStoreId?: string
  /**
   * Indication of whether this download is thought to be safe or known to be suspicious.
  */
    danger?: DangerType
  /**
   * The file's MIME type.
  */
    mime?: string
    startTime?: string
    endTime?: string
  /**
   * Indicates whether the download is progressing, interrupted, or complete.
  */
    state?: State
  /**
   * True if the download has stopped reading data from the host, but kept the connection open.
  */
    paused?: boolean
  /**
   * Why a download was interrupted.
  */
    error?: InterruptReason
  /**
   * Number of bytes received so far from the host, without considering file compression.
  */
    bytesReceived?: number
  /**
   * Number of bytes in the whole file, without considering file compression, or -1 if unknown.
  */
    totalBytes?: number
  /**
   * Number of bytes in the whole file post-decompression, or -1 if unknown.
  */
    fileSize?: number
    exists?: boolean

  }

  /**
 * Download a URL. If the URL uses the HTTP[S] protocol, then the request will include all cookies currently set for its hostname. If both `filename` and `saveAs` are specified, then the Save As dialog will be displayed, pre-populated with the specified `filename`. If the download started successfully, `callback` will be called with the new <a href='#type-DownloadItem'>DownloadItem</a>'s `downloadId`. If there was an error starting the download, then `callback` will be called with `downloadId=undefined` and <a href='extension.html#property-lastError'>chrome.extension.lastError</a> will contain a descriptive string. The error strings are not guaranteed to remain backwards compatible between releases. You must not parse it.
  */
  function download(/**
 * What to download and how.
  */

options: {
    /**
   * The URL to download.
  */
    url: string
  /**
   * A file path relative to the Downloads directory to contain the downloaded file.
  */
    filename?: string
  /**
   * Whether to associate the download with a private browsing session.
  */
    incognito?: boolean
  /**
   * The cookie store ID of the contextual identity; requires "cookies" permission.
  */
    cookieStoreId?: string
    conflictAction?: FilenameConflictAction
  /**
   * Use a file-chooser to allow the user to select a filename. If the option is not specified, the file chooser will be shown only if the Firefox "Always ask you where to save files" option is enabled (i.e. the pref `browser.download.useDownloadDir` is set to `false`).
  */
    saveAs?: boolean
  /**
   * The HTTP method to use if the URL uses the HTTP[S] protocol.
  */
    method?: 'GET'
 | 'POST'
  /**
   * Extra HTTP headers to send with the request if the URL uses the HTTP[s] protocol. Each header is represented as a dictionary containing the keys `name` and either `value` or `binaryValue`, restricted to those allowed by XMLHttpRequest.
  */
    headers?: {
    /**
   * Name of the HTTP header.
  */
    name: string
  /**
   * Value of the HTTP header.
  */
    value: string

  }[]
  /**
   * Post body.
  */
    body?: string
  /**
   * When this flag is set to `true`, then the browser will allow downloads to proceed after encountering HTTP errors such as `404 Not Found`.
  */
    allowHttpErrors?: boolean

  }): Promise<number | null>;
  /**
 * Find <a href='#type-DownloadItem'>DownloadItems</a>. Set `query` to the empty object to get all <a href='#type-DownloadItem'>DownloadItems</a>. To get a specific <a href='#type-DownloadItem'>DownloadItem</a>, set only the `id` field.
  */
  function search(query: DownloadQuery): Promise<DownloadItem[]>;
  /**
 * Pause the download. If the request was successful the download is in a paused state. Otherwise <a href='extension.html#property-lastError'>chrome.extension.lastError</a> contains an error message. The request will fail if the download is not active.
  */
  function pause(/**
 * The id of the download to pause.
  */

downloadId: number): Promise<void | null>;
  /**
 * Resume a paused download. If the request was successful the download is in progress and unpaused. Otherwise <a href='extension.html#property-lastError'>chrome.extension.lastError</a> contains an error message. The request will fail if the download is not active.
  */
  function resume(/**
 * The id of the download to resume.
  */

downloadId: number): Promise<void | null>;
  /**
 * Cancel a download. When `callback` is run, the download is cancelled, completed, interrupted or doesn't exist anymore.
  */
  function cancel(/**
 * The id of the download to cancel.
  */

downloadId: number): Promise<void | null>;
  /**
 * Retrieve an icon for the specified download. For new downloads, file icons are available after the <a href='#event-onCreated'>onCreated</a> event has been received. The image returned by this function while a download is in progress may be different from the image returned after the download is complete. Icon retrieval is done by querying the underlying operating system or toolkit depending on the platform. The icon that is returned will therefore depend on a number of factors including state of the download, platform, registered file types and visual theme. If a file icon cannot be determined, <a href='extension.html#property-lastError'>chrome.extension.lastError</a> will contain an error message.
  */
  function getFileIcon(/**
 * The identifier for the download.
  */

downloadId: number, options?: {
    /**
   * The size of the icon.  The returned icon will be square with dimensions size * size pixels.  The default size for the icon is 32x32 pixels.
  */
    size?: number

  }): Promise<string>;
  /**
 * Open the downloaded file.
  */
  function open(downloadId: number): Promise<void | null>;
  /**
 * Show the downloaded file in its folder in a file manager.
  */
  function show(downloadId: number): Promise<boolean | null>;
  function showDefaultFolder(): void;
  /**
 * Erase matching <a href='#type-DownloadItem'>DownloadItems</a> from history
  */
  function erase(query: DownloadQuery): Promise<number[] | null>;
  function removeFile(downloadId: number): Promise<void | null>;
  /**
 * Prompt the user to either accept or cancel a dangerous download. `acceptDanger()` does not automatically accept dangerous downloads.
  */
  function acceptDanger(downloadId: number): void;
  /**
 * Initiate dragging the file to another application.
  */
  function drag(downloadId: number): void;
  function setShelfEnabled(enabled: boolean): void;
    const onCreated: EventHandler<  /**
 * This event fires with the <a href='#type-DownloadItem'>DownloadItem</a> object when a download begins.
  */
  ((downloadItem: DownloadItem) => void)>;
    const onErased: EventHandler<  /**
 * Fires with the `downloadId` when a download is erased from history.
  */
  ((/**
 * The `id` of the <a href='#type-DownloadItem'>DownloadItem</a> that was erased.
  */

downloadId: number) => void)>;
    const onChanged: EventHandler<  /**
 * When any of a <a href='#type-DownloadItem'>DownloadItem</a>'s properties except `bytesReceived` changes, this event fires with the `downloadId` and an object containing the properties that changed.
  */
  ((downloadDelta: {
    /**
   * The `id` of the <a href='#type-DownloadItem'>DownloadItem</a> that changed.
  */
    id: number
  /**
   * Describes a change in a <a href='#type-DownloadItem'>DownloadItem</a>'s `url`.
  */
    url?: StringDelta
  /**
   * Describes a change in a <a href='#type-DownloadItem'>DownloadItem</a>'s `filename`.
  */
    filename?: StringDelta
  /**
   * Describes a change in a <a href='#type-DownloadItem'>DownloadItem</a>'s `danger`.
  */
    danger?: StringDelta
  /**
   * Describes a change in a <a href='#type-DownloadItem'>DownloadItem</a>'s `mime`.
  */
    mime?: StringDelta
  /**
   * Describes a change in a <a href='#type-DownloadItem'>DownloadItem</a>'s `startTime`.
  */
    startTime?: StringDelta
  /**
   * Describes a change in a <a href='#type-DownloadItem'>DownloadItem</a>'s `endTime`.
  */
    endTime?: StringDelta
  /**
   * Describes a change in a <a href='#type-DownloadItem'>DownloadItem</a>'s `state`.
  */
    state?: StringDelta
    canResume?: BooleanDelta
  /**
   * Describes a change in a <a href='#type-DownloadItem'>DownloadItem</a>'s `paused`.
  */
    paused?: BooleanDelta
  /**
   * Describes a change in a <a href='#type-DownloadItem'>DownloadItem</a>'s `error`.
  */
    error?: StringDelta
  /**
   * Describes a change in a <a href='#type-DownloadItem'>DownloadItem</a>'s `totalBytes`.
  */
    totalBytes?: DoubleDelta
  /**
   * Describes a change in a <a href='#type-DownloadItem'>DownloadItem</a>'s `fileSize`.
  */
    fileSize?: DoubleDelta
    exists?: BooleanDelta

  }) => void)>;
}

  /**
 * Use the `browser.idle` API to detect when the machine's idle state changes.
  */
declare namespace browser.idle {
  type IdleState = string;
  /**
 * Returns "idle" if the user has not generated any input for a specified number of seconds, or "active" otherwise.
  */
  function queryState(/**
 * The system is considered idle if detectionIntervalInSeconds seconds have elapsed since the last user input detected.
  */

detectionIntervalInSeconds: number): Promise<IdleState>;
  /**
 * Sets the interval, in seconds, used to determine when the system is in an idle state for onStateChanged events. The default interval is 60 seconds.
  */
  function setDetectionInterval(/**
 * Threshold, in seconds, used to determine when the system is in an idle state.
  */

intervalInSeconds: number): void;
    const onStateChanged: EventHandler<  /**
 * Fired when the system changes to an active or idle state. The event fires with "idle" if the the user has not generated any input for a specified number of seconds, and "active" when the user generates input on an idle system.
  */
  ((newState: IdleState) => void)>;
}

declare namespace browser.userScripts {
  /**
 * Details of a user script
  */
  export interface UserScriptOptions {
  /**
   * The list of JS files to inject
  */
    js: extensionTypes.ExtensionFileOrCode[]
  /**
   * An opaque user script metadata value
  */
    scriptMetadata?:  extensionTypes.PlainJSONValue
    matches: manifest.MatchPattern[]
    excludeMatches?: manifest.MatchPattern[]
    includeGlobs?: string[]
    excludeGlobs?: string[]
  /**
   * If allFrames is `true`, implies that the JavaScript should be injected into all frames of current page. By default, it's `false` and is only injected into the top frame.
  */
    allFrames?: boolean
  /**
   * If matchAboutBlank is true, then the code is also injected in about:blank and about:srcdoc frames if your extension has access to its parent document. Code cannot be inserted in top-level about:-frames. By default it is `false`.
  */
    matchAboutBlank?: boolean
  /**
   * The soonest that the JavaScript will be injected into the tab. Defaults to "document_idle".
  */
    runAt?:  extensionTypes.RunAt
  /**
   * limit the set of matched tabs to those that belong to the given cookie store id
  */
    cookieStoreId?: string[] | string

  }

  /**
 * An object that represents a user script registered programmatically
  */
  export interface RegisteredUserScript {
  /**
 * Unregister a user script registered programmatically
  */

  unregister(): Promise<any>;


  }

  /**
 * Register a user script programmatically given its $(ref:userScripts.UserScriptOptions), and resolves to a $(ref:userScripts.RegisteredUserScript) instance
  */
  function register(userScriptOptions: UserScriptOptions): Promise<any>;
    const onBeforeScript: EventHandler<  /**
 * Event called when a new userScript global has been created
  */
  ((userScript: {
    /**
   * The userScript metadata (as set in userScripts.register)
  */
    metadata: any
  /**
   * The userScript global
  */
    global: any
  /**
   * Exports all the properties of a given plain object as userScript globals
  */
    defineGlobals: /* or any?  */   (/**
 * A plain object whose properties are exported as userScript globals
  */

sourceObject: /* "unknown" undefined */ object) => void , 
 /* x7 */ 

  /**
   * Convert a given value to make it accessible to the userScript code
  */
    export: /* or any?  */   (/**
 * A value to convert into an object accessible to the userScript
  */

value: any) => any , 
 /* x7 */ 


  }) => void)>;
}

  /**
 * Use the `browser.pageAction` API to put icons inside the address bar. Page actions represent actions that can be taken on the current page, but that aren't applicable to all pages.
  */
declare namespace browser.pageAction {
  /**
 * Pixel data for an image. Must be an ImageData object (for example, from a `canvas` element).
  */
  export interface ImageDataType {
  }

  /**
 * Information sent when a page action is clicked.
  */
  export interface OnClickData {
  /**
   * An array of keyboard modifiers that were held while the menu item was clicked.
  */
    modifiers: 'Shift'
 | 'Alt'
 | 'Command'
 | 'Ctrl'
 | 'MacCtrl'[]
  /**
   * An integer value of button by which menu item was clicked.
  */
    button?: number

  }

  /**
 * Shows the page action. The page action is shown whenever the tab is selected.
  */
  function show(/**
 * The id of the tab for which you want to modify the page action.
  */

tabId: number): Promise<void | null>;
  /**
 * Hides the page action.
  */
  function hide(/**
 * The id of the tab for which you want to modify the page action.
  */

tabId: number): Promise<void | null>;
  /**
 * Checks whether the page action is shown.
  */
  function isShown(details: {
    /**
   * Specify the tab to get the shownness from.
  */
    tabId: number

  }): Promise<any>;
  /**
 * Sets the title of the page action. This is displayed in a tooltip over the page action.
  */
  function setTitle(details: {
    /**
   * The id of the tab for which you want to modify the page action.
  */
    tabId: number
  /**
   * The tooltip string.
  */
    title: string | void /* could not determine correct type */

  }): void;
  /**
 * Gets the title of the page action.
  */
  function getTitle(details: {
    /**
   * Specify the tab to get the title from.
  */
    tabId: number

  }): Promise<string>;
  /**
 * Sets the icon for the page action. The icon can be specified either as the path to an image file or as the pixel data from a canvas element, or as dictionary of either one of those. Either the **path** or the **imageData** property must be specified.
  */
  function setIcon(details: {
    /**
   * The id of the tab for which you want to modify the page action.
  */
    tabId: number
  /**
   * Either an ImageData object or a dictionary {size -> ImageData} representing icon to be set. If the icon is specified as a dictionary, the actual image to be used is chosen depending on screen's pixel density. If the number of image pixels that fit into one screen space unit equals `scale`, then image with size `scale` * 19 will be selected. Initially only scales 1 and 2 will be supported. At least one image must be specified. Note that 'details.imageData = foo' is equivalent to 'details.imageData = {'19': foo}'
  */
    imageData?: ImageDataType | /* "unknown" undefined */ object
  /**
   * Either a relative image path or a dictionary {size -> relative image path} pointing to icon to be set. If the icon is specified as a dictionary, the actual image to be used is chosen depending on screen's pixel density. If the number of image pixels that fit into one screen space unit equals `scale`, then image with size `scale` * 19 will be selected. Initially only scales 1 and 2 will be supported. At least one image must be specified. Note that 'details.path = foo' is equivalent to 'details.imageData = {'19': foo}'
  */
    path?: string | /* "unknown" undefined */ object

  }): Promise<void | null>;
  /**
 * Sets the html document to be opened as a popup when the user clicks on the page action's icon.
  */
  function setPopup(details: {
    /**
   * The id of the tab for which you want to modify the page action.
  */
    tabId: number
  /**
   * The html file to show in a popup.  If set to the empty string (''), no popup is shown.
  */
    popup: string | void /* could not determine correct type */

  }): Promise<any>;
  /**
 * Gets the html document set as the popup for this page action.
  */
  function getPopup(details: {
    /**
   * Specify the tab to get the popup from.
  */
    tabId: number

  }): Promise<string>;
  /**
 * Opens the extension page action in the active window.
  */
  function openPopup(): Promise<any>;
    const onClicked: EventHandler<  /**
 * Fired when a page action icon is clicked.  This event will not fire if the page action has a popup.
  */
  ((tab:  tabs.Tab, info?: OnClickData) => void)>;
}

declare namespace browser.experiments {
  export interface ExperimentAPI {
    schema: ExperimentURL
    parent?: {
      events?: APIEvents
    paths?: APIPaths
    script: ExperimentURL
    scopes?: APIParentScope[]

  }
    child?: {
      paths: APIPaths
    script: ExperimentURL
    scopes: APIChildScope[]

  }

  }

  type ExperimentURL = string;
  type APIPaths = APIPath[];
  type APIPath = string[];
  type APIEvents = APIEvent[];
  type APIEvent = string;
  type APIParentScope = string;
  type APIChildScope = string;
}

  /**
 * Exposes the browser's profiler.
  */
declare namespace browser.geckoProfiler {
  type ProfilerFeature = string;
  type supports = string;
  /**
 * Starts the profiler with the specified settings.
  */
  function start(settings: {
    /**
   * The maximum size in bytes of the buffer used to store profiling data. A larger value allows capturing a profile that covers a greater amount of time.
  */
    bufferSize: number
  /**
   * The length of the window of time that's kept in the buffer. Any collected samples are discarded as soon as they are older than the number of seconds specified in this setting. Zero means no duration restriction.
  */
    windowLength?: number
  /**
   * Interval in milliseconds between samples of profiling data. A smaller value will increase the detail of the profiles captured.
  */
    interval: number
  /**
   * A list of active features for the profiler.
  */
    features: ProfilerFeature[]
  /**
   * A list of thread names for which to capture profiles.
  */
    threads?: string[]

  }): Promise<any>;
  /**
 * Stops the profiler and discards any captured profile data.
  */
  function stop(): Promise<any>;
  /**
 * Pauses the profiler, keeping any profile data that is already written.
  */
  function pause(): Promise<any>;
  /**
 * Resumes the profiler with the settings that were initially used to start it.
  */
  function resume(): Promise<any>;
  /**
 * Gathers the profile data from the current profiling session, and writes it to disk. The returned promise resolves to a path that locates the created file.
  */
  function dumpProfileToFile(/**
 * The name of the file inside the profile/profiler directory
  */

fileName: string): Promise<any>;
  /**
 * Gathers the profile data from the current profiling session.
  */
  function getProfile(): Promise<any>;
  /**
 * Gathers the profile data from the current profiling session. The returned promise resolves to an array buffer that contains a JSON string.
  */
  function getProfileAsArrayBuffer(): Promise<any>;
  /**
 * Gathers the profile data from the current profiling session. The returned promise resolves to an array buffer that contains a gzipped JSON string.
  */
  function getProfileAsGzippedArrayBuffer(): Promise<any>;
  /**
 * Gets the debug symbols for a particular library.
  */
  function getSymbols(/**
 * The name of the library's debug file. For example, 'xul.pdb
  */

debugName: string, /**
 * The Breakpad ID of the library
  */

breakpadId: string): Promise<any>;
    const onRunning: EventHandler<  /**
 * Fires when the profiler starts/stops running.
  */
  ((/**
 * Whether the profiler is running or not. Pausing the profiler will not affect this value.
  */

isRunning: boolean) => void)>;
}

  /**
 * Use the chrome.identity API to get OAuth2 access tokens. 
  */
declare namespace browser.identity {
  /**
 * An object encapsulating an OAuth account id.
  */
  export interface AccountInfo {
  /**
   * A unique identifier for the account. This ID will not change for the lifetime of the account. 
  */
    id: string

  }

  /**
 * Retrieves a list of AccountInfo objects describing the accounts present on the profile.
  */
  function getAccounts(): Promise<AccountInfo[]>;
  /**
 * Gets an OAuth2 access token using the client ID and scopes specified in the oauth2 section of manifest.json.
  */
  function getAuthToken(details?: {
      interactive?: boolean
    account?: AccountInfo
    scopes?: string[]

  }): Promise<AccountInfo[] | null>;
  /**
 * Retrieves email address and obfuscated gaia id of the user signed into a profile.
  */
  function getProfileUserInfo(): Promise<{
      email: string
    id: string

  }>;
  /**
 * Removes an OAuth2 access token from the Identity API's token cache.
  */
  function removeCachedAuthToken(details: {
      token: string

  }): Promise<{
      email: string
    id: string

  } | null>;
  /**
 * Starts an auth flow at the specified URL.
  */
  function launchWebAuthFlow(details: {
      url:  manifest.HttpURL
    interactive?: boolean

  }): Promise<string>;
  /**
 * Generates a redirect URL to be used in |launchWebAuthFlow|.
  */
  function getRedirectURL(/**
 * The path appended to the end of the generated URL. 
  */

path?: string): string;
    const onSignInChanged: EventHandler<  /**
 * Fired when signin state changes for an account on the user's profile.
  */
  ((account: AccountInfo, signedIn: boolean) => void)>;
}

  /**
 * Offers the ability to write to the clipboard. Reading is not supported because the clipboard can already be read through the standard web platform APIs.
  */
declare namespace browser.clipboard {
  /**
 * Copy an image to the clipboard. The image is re-encoded before it is written to the clipboard. If the image is invalid, the clipboard is not modified.
  */
  function setImageData(/**
 * The image data to be copied.
  */

imageData: /* "unknown" undefined */ object, /**
 * The type of imageData.
  */

imageType: 'jpeg'
 | 'png'): Promise<any>;
}

  /**
 * The `browser.extensionTypes` API contains type declarations for WebExtensions.
  */
declare namespace browser.extensionTypes {
  /**
 * The format of an image.
  */
  /**
 * The format of an image.
  */
  type ImageFormat = string;
  /**
 * Details about the format, quality, area and scale of the capture.
  */
  export interface ImageDetails {
  /**
   * The format of the resulting image.  Default is `"jpeg"`.
  */
    format?: ImageFormat
  /**
   * When format is `"jpeg"`, controls the quality of the resulting image.  This value is ignored for PNG images.  As quality is decreased, the resulting image will have more visual artifacts, and the number of bytes needed to store it will decrease.
  */
    quality?: number
  /**
   * The area of the document to capture, in CSS pixels, relative to the page.  If omitted, capture the visible viewport.
  */
    rect?: {
      x: number
    y: number
    width: number
    height: number

  }
  /**
   * The scale of the resulting image.  Defaults to `devicePixelRatio`.
  */
    scale?: number
  /**
   * If true, temporarily resets the scroll position of the document to 0. Only takes effect if rect is also specified.
  */
    resetScrollPosition?: boolean

  }

  /**
 * The soonest that the JavaScript or CSS will be injected into the tab.
  */
  /**
 * The soonest that the JavaScript or CSS will be injected into the tab.
  */
  type RunAt = string;
  /**
 * The JavaScript world for a script to execute within. `ISOLATED` is the default execution environment of content scripts, `MAIN` is the web page's execution environment.
  */
  /**
 * The JavaScript world for a script to execute within. `ISOLATED` is the default execution environment of content scripts, `MAIN` is the web page's execution environment.
  */
  type ExecutionWorld = string;
  /**
 * The origin of the CSS to inject, this affects the cascading order (priority) of the stylesheet.
  */
  /**
 * The origin of the CSS to inject, this affects the cascading order (priority) of the stylesheet.
  */
  type CSSOrigin = string;
  /**
 * Details of the script or CSS to inject. Either the code or the file property must be set, but both may not be set at the same time.
  */
  export interface InjectDetails {
  /**
   * JavaScript or CSS code to inject.<br><br>**Warning:**<br>Be careful using the `code` parameter. Incorrect use of it may open your extension to <a href="https://en.wikipedia.org/wiki/Cross-site_scripting">cross site scripting</a> attacks.
  */
    code?: string
  /**
   * JavaScript or CSS file to inject.
  */
    file?: string
  /**
   * If allFrames is `true`, implies that the JavaScript or CSS should be injected into all frames of current page. By default, it's `false` and is only injected into the top frame.
  */
    allFrames?: boolean
  /**
   * If matchAboutBlank is true, then the code is also injected in about:blank and about:srcdoc frames if your extension has access to its parent document. Code cannot be inserted in top-level about:-frames. By default it is `false`.
  */
    matchAboutBlank?: boolean
  /**
   * The ID of the frame to inject the script into. This may not be used in combination with `allFrames`.
  */
    frameId?: number
  /**
   * The soonest that the JavaScript or CSS will be injected into the tab. Defaults to "document_idle".
  */
    runAt?: RunAt
  /**
   * The css origin of the stylesheet to inject. Defaults to "author".
  */
    cssOrigin?: CSSOrigin

  }

  type Date = string | number | /* "unknown" undefined */ object;
  type ExtensionFileOrCode = {
      file:  manifest.ExtensionURL

  } | {
      code: string

  };
  /**
 * A plain JSON value
  */
  type PlainJSONValue = void /* could not determine correct type */ | number | string | boolean | PlainJSONValue[] | /* "unknown" undefined */ object;
}

  /**
 * Use the `browser.telemetry` API to send telemetry data to the Mozilla Telemetry service. Restricted to Mozilla privileged webextensions.
  */
declare namespace browser.telemetry {
  /**
 * Type of scalar: 'count' for numeric values, 'string' for string values, 'boolean' for boolean values. Maps to `nsITelemetry.SCALAR_TYPE_*`.
  */
  /**
 * Type of scalar: 'count' for numeric values, 'string' for string values, 'boolean' for boolean values. Maps to `nsITelemetry.SCALAR_TYPE_*`.
  */
  type ScalarType = string;
  /**
 * Represents registration data for a Telemetry scalar.
  */
  export interface ScalarData {
    kind: ScalarType
  /**
   * True if this is a keyed scalar.
  */
    keyed?: boolean
  /**
   * True if this data should be recorded on release.
  */
    record_on_release?: boolean
  /**
   * True if this scalar entry is expired. This allows recording it without error, but it will be discarded.
  */
    expired?: boolean

  }

  /**
 * Represents registration data for a Telemetry event.
  */
  export interface EventData {
  /**
   * List of methods for this event entry.
  */
    methods: string[]
  /**
   * List of objects for this event entry.
  */
    objects: string[]
  /**
   * List of allowed extra keys for this event entry.
  */
    extra_keys: string[]
  /**
   * True if this data should be recorded on release.
  */
    record_on_release?: boolean
  /**
   * True if this event entry is expired. This allows recording it without error, but it will be discarded.
  */
    expired?: boolean

  }

  /**
 * Submits a custom ping to the Telemetry back-end. See `submitExternalPing` inside TelemetryController.sys.mjs for more details.
  */
  function submitPing(/**
 * The type of the ping.
  */

type: string, /**
 * The data payload for the ping.
  */

message: /* "unknown" undefined */ object, /**
 * Options object.
  */

options: {
    /**
   * True if the ping should contain the client id.
  */
    addClientId?: boolean
  /**
   * True if the ping should contain the environment data.
  */
    addEnvironment?: boolean
  /**
   * Set to override the environment data.
  */
    overrideEnvironment?: /* "unknown" undefined */ object
  /**
   * If true, send the ping using the PingSender.
  */
    usePingSender?: boolean

  }): Promise<any>;
  /**
 * Submits a custom ping to the Telemetry back-end, with an encrypted payload. Requires a telemetry entry in the manifest to be used.
  */
  function submitEncryptedPing(/**
 * The data payload for the ping, which will be encrypted.
  */

message: /* "unknown" undefined */ object, /**
 * Options object.
  */

options: {
    /**
   * Schema name used for payload.
  */
    schemaName: string
  /**
   * Schema version used for payload.
  */
    schemaVersion: number

  }): Promise<any>;
  /**
 * Checks if Telemetry upload is enabled.
  */
  function canUpload(): Promise<any>;
  /**
 * Adds the value to the given scalar.
  */
  function scalarAdd(/**
 * The scalar name.
  */

name: string, /**
 * The numeric value to add to the scalar. Only unsigned integers supported.
  */

value: number): Promise<any>;
  /**
 * Sets the named scalar to the given value. Throws if the value type doesn't match the scalar type.
  */
  function scalarSet(/**
 * The scalar name
  */

name: string, /**
 * The value to set the scalar to
  */

value: string | boolean | number | /* "unknown" undefined */ object): Promise<any>;
  /**
 * Sets the scalar to the maximum of the current and the passed value
  */
  function scalarSetMaximum(/**
 * The scalar name.
  */

name: string, /**
 * The numeric value to set the scalar to. Only unsigned integers supported.
  */

value: number): Promise<any>;
  /**
 * Adds the value to the given keyed scalar.
  */
  function keyedScalarAdd(/**
 * The scalar name
  */

name: string, /**
 * The key name
  */

key: string, /**
 * The numeric value to add to the scalar. Only unsigned integers supported.
  */

value: number): Promise<any>;
  /**
 * Sets the keyed scalar to the given value. Throws if the value type doesn't match the scalar type.
  */
  function keyedScalarSet(/**
 * The scalar name.
  */

name: string, /**
 * The key name.
  */

key: string, /**
 * The value to set the scalar to.
  */

value: string | boolean | number | /* "unknown" undefined */ object): Promise<any>;
  /**
 * Sets the keyed scalar to the maximum of the current and the passed value
  */
  function keyedScalarSetMaximum(/**
 * The scalar name.
  */

name: string, /**
 * The key name.
  */

key: string, /**
 * The numeric value to set the scalar to. Only unsigned integers supported.
  */

value: number): Promise<any>;
  /**
 * Record an event in Telemetry. Throws when trying to record an unknown event.
  */
  function recordEvent(/**
 * The category name.
  */

category: string, /**
 * The method name.
  */

method: string, /**
 * The object name.
  */

object: string, /**
 * An optional string value to record.
  */

value?: string, /**
 * An optional object of the form (string -> string). It should only contain registered extra keys.
  */

extra?: /* "unknown" undefined */ object): Promise<any>;
  /**
 * Register new scalars to record them from addons. See nsITelemetry.idl for more details.
  */
  function registerScalars(/**
 * The unique category the scalars are registered in.
  */

category: string, /**
 * An object that contains registration data for multiple scalars. Each property name is the scalar name, and the corresponding property value is an object of ScalarData type.
  */

data: /* "unknown" undefined */ object): Promise<any>;
  /**
 * Register new events to record them from addons. See nsITelemetry.idl for more details.
  */
  function registerEvents(/**
 * The unique category the events are registered in.
  */

category: string, /**
 * An object that contains registration data for 1+ events. Each property name is the category name, and the corresponding property value is an object of EventData type.
  */

data: /* "unknown" undefined */ object): Promise<any>;
  /**
 * Enable recording of events in a category. Events default to recording disabled. This allows to toggle recording for all events in the specified category.
  */
  function setEventRecordingEnabled(/**
 * The category name.
  */

category: string, /**
 * Whether recording is enabled for events in that category.
  */

enabled: boolean): Promise<any>;
}

  /**
 * Use the `browser.cookies` API to query and modify cookies, and to be notified when they change.
  */
declare namespace browser.cookies {
  /**
 * A cookie's 'SameSite' state (https://tools.ietf.org/html/draft-west-first-party-cookies). 'no_restriction' corresponds to a cookie set without a 'SameSite' attribute, 'lax' to 'SameSite=Lax', and 'strict' to 'SameSite=Strict'.
  */
  /**
 * A cookie's 'SameSite' state (https://tools.ietf.org/html/draft-west-first-party-cookies). 'no_restriction' corresponds to a cookie set without a 'SameSite' attribute, 'lax' to 'SameSite=Lax', and 'strict' to 'SameSite=Strict'.
  */
  type SameSiteStatus = string;
  /**
 * The description of the storage partition of a cookie. This object may be omitted (null) if a cookie is not partitioned.
  */
  export interface PartitionKey {
  /**
   * The first-party URL of the cookie, if the cookie is in storage partitioned by the top-level site.
  */
    topLevelSite?: string

  }

  /**
 * Represents information about an HTTP cookie.
  */
  export interface Cookie {
  /**
   * The name of the cookie.
  */
    name: string
  /**
   * The value of the cookie.
  */
    value: string
  /**
   * The domain of the cookie (e.g. "www.google.com", "example.com").
  */
    domain: string
  /**
   * True if the cookie is a host-only cookie (i.e. a request's host must exactly match the domain of the cookie).
  */
    hostOnly: boolean
  /**
   * The path of the cookie.
  */
    path: string
  /**
   * True if the cookie is marked as Secure (i.e. its scope is limited to secure channels, typically HTTPS).
  */
    secure: boolean
  /**
   * True if the cookie is marked as HttpOnly (i.e. the cookie is inaccessible to client-side scripts).
  */
    httpOnly: boolean
  /**
   * The cookie's same-site status (i.e. whether the cookie is sent with cross-site requests).
  */
    sameSite: SameSiteStatus
  /**
   * True if the cookie is a session cookie, as opposed to a persistent cookie with an expiration date.
  */
    session: boolean
  /**
   * The expiration date of the cookie as the number of seconds since the UNIX epoch. Not provided for session cookies.
  */
    expirationDate?: number
  /**
   * The ID of the cookie store containing this cookie, as provided in getAllCookieStores().
  */
    storeId: string
  /**
   * The first-party domain of the cookie.
  */
    firstPartyDomain: string
  /**
   * The cookie's storage partition, if any. null if not partitioned.
  */
    partitionKey?: PartitionKey

  }

  /**
 * Represents a cookie store in the browser. An incognito mode window, for instance, uses a separate cookie store from a non-incognito window.
  */
  export interface CookieStore {
  /**
   * The unique identifier for the cookie store.
  */
    id: string
  /**
   * Identifiers of all the browser tabs that share this cookie store.
  */
    tabIds: number[]
  /**
   * Indicates if this is an incognito cookie store
  */
    incognito: boolean

  }

  /**
 * The underlying reason behind the cookie's change. If a cookie was inserted, or removed via an explicit call to $(ref:cookies.remove), "cause" will be "explicit". If a cookie was automatically removed due to expiry, "cause" will be "expired". If a cookie was removed due to being overwritten with an already-expired expiration date, "cause" will be set to "expired_overwrite".  If a cookie was automatically removed due to garbage collection, "cause" will be "evicted".  If a cookie was automatically removed due to a "set" call that overwrote it, "cause" will be "overwrite". Plan your response accordingly.
  */
  /**
 * The underlying reason behind the cookie's change. If a cookie was inserted, or removed via an explicit call to $(ref:cookies.remove), "cause" will be "explicit". If a cookie was automatically removed due to expiry, "cause" will be "expired". If a cookie was removed due to being overwritten with an already-expired expiration date, "cause" will be set to "expired_overwrite".  If a cookie was automatically removed due to garbage collection, "cause" will be "evicted".  If a cookie was automatically removed due to a "set" call that overwrote it, "cause" will be "overwrite". Plan your response accordingly.
  */
  type OnChangedCause = string;
  /**
 * Retrieves information about a single cookie. If more than one cookie of the same name exists for the given URL, the one with the longest path will be returned. For cookies with the same path length, the cookie with the earliest creation time will be returned.
  */
  function get(/**
 * Details to identify the cookie being retrieved.
  */

details: {
    /**
   * The URL with which the cookie to retrieve is associated. This argument may be a full URL, in which case any data following the URL path (e.g. the query string) is simply ignored. If host permissions for this URL are not specified in the manifest file, the API call will fail.
  */
    url: string
  /**
   * The name of the cookie to retrieve.
  */
    name: string
  /**
   * The ID of the cookie store in which to look for the cookie. By default, the current execution context's cookie store will be used.
  */
    storeId?: string
  /**
   * The first-party domain which the cookie to retrieve is associated. This attribute is required if First-Party Isolation is enabled.
  */
    firstPartyDomain?: string
  /**
   * The storage partition, if the cookie is part of partitioned storage. By default, only non-partitioned cookies are returned.
  */
    partitionKey?: PartitionKey

  }): Promise<Cookie>;
  /**
 * Retrieves all cookies from a single cookie store that match the given information.  The cookies returned will be sorted, with those with the longest path first.  If multiple cookies have the same path length, those with the earliest creation time will be first.
  */
  function getAll(/**
 * Information to filter the cookies being retrieved.
  */

details: {
    /**
   * Restricts the retrieved cookies to those that would match the given URL.
  */
    url?: string
  /**
   * Filters the cookies by name.
  */
    name?: string
  /**
   * Restricts the retrieved cookies to those whose domains match or are subdomains of this one.
  */
    domain?: string
  /**
   * Restricts the retrieved cookies to those whose path exactly matches this string.
  */
    path?: string
  /**
   * Filters the cookies by their Secure property.
  */
    secure?: boolean
  /**
   * Filters out session vs. persistent cookies.
  */
    session?: boolean
  /**
   * The cookie store to retrieve cookies from. If omitted, the current execution context's cookie store will be used.
  */
    storeId?: string
  /**
   * Restricts the retrieved cookies to those whose first-party domains match this one. This attribute is required if First-Party Isolation is enabled. To not filter by a specific first-party domain, use `null` or `undefined`.
  */
    firstPartyDomain?: string
  /**
   * Selects a specific storage partition to look up cookies. Defaults to null, in which case only non-partitioned cookies are retrieved. If an object iis passed, partitioned cookies are also included, and filtered based on the keys present in the given PartitionKey description. An empty object ({}) returns all cookies (partitioned + unpartitioned), a non-empty object (e.g. {topLevelSite: '...'}) only returns cookies whose partition match all given attributes.
  */
    partitionKey?: PartitionKey

  }): Promise<Cookie[]>;
  /**
 * Sets a cookie with the given cookie data; may overwrite equivalent cookies if they exist.
  */
  function set(/**
 * Details about the cookie being set.
  */

details: {
    /**
   * The request-URI to associate with the setting of the cookie. This value can affect the default domain and path values of the created cookie. If host permissions for this URL are not specified in the manifest file, the API call will fail.
  */
    url: string
  /**
   * The name of the cookie. Empty by default if omitted.
  */
    name?: string
  /**
   * The value of the cookie. Empty by default if omitted.
  */
    value?: string
  /**
   * The domain of the cookie. If omitted, the cookie becomes a host-only cookie.
  */
    domain?: string
  /**
   * The path of the cookie. Defaults to the path portion of the url parameter.
  */
    path?: string
  /**
   * Whether the cookie should be marked as Secure. Defaults to false.
  */
    secure?: boolean
  /**
   * Whether the cookie should be marked as HttpOnly. Defaults to false.
  */
    httpOnly?: boolean
  /**
   * The cookie's same-site status.
  */
    sameSite?: SameSiteStatus
  /**
   * The expiration date of the cookie as the number of seconds since the UNIX epoch. If omitted, the cookie becomes a session cookie.
  */
    expirationDate?: number
  /**
   * The ID of the cookie store in which to set the cookie. By default, the cookie is set in the current execution context's cookie store.
  */
    storeId?: string
  /**
   * The first-party domain of the cookie. This attribute is required if First-Party Isolation is enabled.
  */
    firstPartyDomain?: string
  /**
   * The storage partition, if the cookie is part of partitioned storage. By default, non-partitioned storage is used.
  */
    partitionKey?: PartitionKey

  }): Promise<Cookie | null>;
  /**
 * Deletes a cookie by name.
  */
  function remove(/**
 * Information to identify the cookie to remove.
  */

details: {
    /**
   * The URL associated with the cookie. If host permissions for this URL are not specified in the manifest file, the API call will fail.
  */
    url: string
  /**
   * The name of the cookie to remove.
  */
    name: string
  /**
   * The ID of the cookie store to look in for the cookie. If unspecified, the cookie is looked for by default in the current execution context's cookie store.
  */
    storeId?: string
  /**
   * The first-party domain associated with the cookie. This attribute is required if First-Party Isolation is enabled.
  */
    firstPartyDomain?: string
  /**
   * The storage partition, if the cookie is part of partitioned storage. By default, non-partitioned storage is used.
  */
    partitionKey?: PartitionKey

  }): Promise<{
    /**
   * The URL associated with the cookie that's been removed.
  */
    url: string
  /**
   * The name of the cookie that's been removed.
  */
    name: string
  /**
   * The ID of the cookie store from which the cookie was removed.
  */
    storeId: string
  /**
   * The first-party domain associated with the cookie that's been removed.
  */
    firstPartyDomain: string
  /**
   * The storage partition, if the cookie is part of partitioned storage. null if not partitioned.
  */
    partitionKey?: PartitionKey

  } | null>;
  /**
 * Lists all existing cookie stores.
  */
  function getAllCookieStores(): Promise<CookieStore[]>;
    const onChanged: EventHandler<  /**
 * Fired when a cookie is set or removed. As a special case, note that updating a cookie's properties is implemented as a two step process: the cookie to be updated is first removed entirely, generating a notification with "cause" of "overwrite" .  Afterwards, a new cookie is written with the updated values, generating a second notification with "cause" "explicit".
  */
  ((changeInfo: {
    /**
   * True if a cookie was removed.
  */
    removed: boolean
  /**
   * Information about the cookie that was set or removed.
  */
    cookie: Cookie
  /**
   * The underlying reason behind the cookie's change.
  */
    cause: OnChangedCause

  }) => void)>;
}

declare namespace browser.notifications {
  type TemplateType = string;
  type PermissionLevel = string;
  export interface NotificationItem {
  /**
   * Title of one item of a list notification.
  */
    title: string
  /**
   * Additional details about this item.
  */
    message: string

  }

  export interface CreateNotificationOptions {
  /**
   * Which type of notification to display.
  */
    type: TemplateType
  /**
   * A URL to the sender's avatar, app icon, or a thumbnail for image notifications.
  */
    iconUrl?: string
  /**
   * A URL to the app icon mask.
  */
    appIconMaskUrl?: string
  /**
   * Title of the notification (e.g. sender name for email).
  */
    title: string
  /**
   * Main notification content.
  */
    message: string
  /**
   * Alternate notification content with a lower-weight font.
  */
    contextMessage?: string
  /**
   * Priority ranges from -2 to 2. -2 is lowest priority. 2 is highest. Zero is default.
  */
    priority?: number
  /**
   * A timestamp associated with the notification, in milliseconds past the epoch.
  */
    eventTime?: number
  /**
   * A URL to the image thumbnail for image-type notifications.
  */
    imageUrl?: string
  /**
   * Items for multi-item notifications.
  */
    items?: NotificationItem[]
  /**
   * Current progress ranges from 0 to 100.
  */
    progress?: number
  /**
   * Whether to show UI indicating that the app will visibly respond to clicks on the body of a notification.
  */
    isClickable?: boolean

  }

  export interface UpdateNotificationOptions {
  /**
   * Which type of notification to display.
  */
    type?: TemplateType
  /**
   * A URL to the sender's avatar, app icon, or a thumbnail for image notifications.
  */
    iconUrl?: string
  /**
   * A URL to the app icon mask.
  */
    appIconMaskUrl?: string
  /**
   * Title of the notification (e.g. sender name for email).
  */
    title?: string
  /**
   * Main notification content.
  */
    message?: string
  /**
   * Alternate notification content with a lower-weight font.
  */
    contextMessage?: string
  /**
   * Priority ranges from -2 to 2. -2 is lowest priority. 2 is highest. Zero is default.
  */
    priority?: number
  /**
   * A timestamp associated with the notification, in milliseconds past the epoch.
  */
    eventTime?: number
  /**
   * A URL to the image thumbnail for image-type notifications.
  */
    imageUrl?: string
  /**
   * Items for multi-item notifications.
  */
    items?: NotificationItem[]
  /**
   * Current progress ranges from 0 to 100.
  */
    progress?: number
  /**
   * Whether to show UI indicating that the app will visibly respond to clicks on the body of a notification.
  */
    isClickable?: boolean

  }

  /**
 * Creates and displays a notification.
  */
  function create(/**
 * Identifier of the notification. If it is empty, this method generates an id. If it matches an existing notification, this method first clears that notification before proceeding with the create operation.
  */

notificationId: string, /**
 * Contents of the notification.
  */

options: CreateNotificationOptions): Promise<string | null>;
  function create(/**
 * Contents of the notification.
  */

options: CreateNotificationOptions): Promise<string | null>;
  /**
 * Updates an existing notification.
  */
  function update(/**
 * The id of the notification to be updated.
  */

notificationId: string, /**
 * Contents of the notification to update to.
  */

options: UpdateNotificationOptions): Promise<boolean | null>;
  /**
 * Clears an existing notification.
  */
  function clear(/**
 * The id of the notification to be updated.
  */

notificationId: string): Promise<boolean | null>;
  /**
 * Retrieves all the notifications.
  */
  function getAll(): Promise</* "unknown" undefined */ object>;
  /**
 * Retrieves whether the user has enabled notifications from this app or extension.
  */
  function getPermissionLevel(): Promise<PermissionLevel>;
    const onClosed: EventHandler<  /**
 * Fired when the notification closed, either by the system or by user action.
  */
  ((/**
 * The notificationId of the closed notification.
  */

notificationId: string, /**
 * True if the notification was closed by the user.
  */

byUser: boolean) => void)>;
    const onClicked: EventHandler<  /**
 * Fired when the user clicked in a non-button area of the notification.
  */
  ((/**
 * The notificationId of the clicked notification.
  */

notificationId: string) => void)>;
    const onButtonClicked: EventHandler<  /**
 * Fired when the  user pressed a button in the notification.
  */
  ((/**
 * The notificationId of the clicked notification.
  */

notificationId: string, /**
 * The index of the button clicked by the user.
  */

buttonIndex: number) => void)>;
    const onPermissionLevelChanged: EventHandler<  /**
 * Fired when the user changes the permission level.
  */
  ((/**
 * The new permission level.
  */

level: PermissionLevel) => void)>;
    const onShowSettings: EventHandler<  /**
 * Fired when the user clicked on a link for the app's notification settings.
  */
  (() => void)>;
    const onShown: EventHandler<  /**
 * Fired when the notification is shown.
  */
  ((/**
 * The notificationId of the shown notification.
  */

notificationId: string) => void)>;
}

  /**
 * Use the `browser.webNavigation` API to receive notifications about the status of navigation requests in-flight.
  */
declare namespace browser.webNavigation {
  /**
 * Cause of the navigation. The same transition types as defined in the history API are used. These are the same transition types as defined in the $(topic:transition_types)[history API] except with `"start_page"` in place of `"auto_toplevel"` (for backwards compatibility).
  */
  /**
 * Cause of the navigation. The same transition types as defined in the history API are used. These are the same transition types as defined in the $(topic:transition_types)[history API] except with `"start_page"` in place of `"auto_toplevel"` (for backwards compatibility).
  */
  type TransitionType = string;
  type TransitionQualifier = string;
  export interface EventUrlFilters {
    url: events.UrlFilter[]

  }

  /**
 * Retrieves information about the given frame. A frame refers to an &lt;iframe&gt; or a &lt;frame&gt; of a web page and is identified by a tab ID and a frame ID.
  */
  function getFrame(/**
 * Information about the frame to retrieve information about.
  */

details: {
    /**
   * The ID of the tab in which the frame is.
  */
    tabId: number
  /**
   * The ID of the process runs the renderer for this tab.
  */
    processId?: number
  /**
   * The ID of the frame in the given tab.
  */
    frameId: number

  }): Promise<{
    /**
   * True if the last navigation in this frame was interrupted by an error, i.e. the onErrorOccurred event fired.
  */
    errorOccurred?: boolean
  /**
   * The URL currently associated with this frame, if the frame identified by the frameId existed at one point in the given tab. The fact that an URL is associated with a given frameId does not imply that the corresponding frame still exists.
  */
    url: string
  /**
   * The ID of the tab in which the frame is.
  */
    tabId: number
  /**
   * The ID of the frame. 0 indicates that this is the main frame; a positive value indicates the ID of a subframe.
  */
    frameId: number
  /**
   * ID of frame that wraps the frame. Set to -1 of no parent frame exists.
  */
    parentFrameId: number

  }>;
  /**
 * Retrieves information about all frames of a given tab.
  */
  function getAllFrames(/**
 * Information about the tab to retrieve all frames from.
  */

details: {
    /**
   * The ID of the tab.
  */
    tabId: number

  }): Promise<{
    /**
   * True if the last navigation in this frame was interrupted by an error, i.e. the onErrorOccurred event fired.
  */
    errorOccurred?: boolean
  /**
   * The ID of the tab in which the frame is.
  */
    tabId: number
  /**
   * The ID of the frame. 0 indicates that this is the main frame; a positive value indicates the ID of a subframe.
  */
    frameId: number
  /**
   * ID of frame that wraps the frame. Set to -1 of no parent frame exists.
  */
    parentFrameId: number
  /**
   * The URL currently associated with this frame.
  */
    url: string

  }[]>;
    const onBeforeNavigate: EventHandler<  /**
 * Fired when a navigation is about to occur.
  */
  ((details: {
    /**
   * The ID of the tab in which the navigation is about to occur.
  */
    tabId: number
    url: string
  /**
   * 0 indicates the navigation happens in the tab content window; a positive value indicates navigation in a subframe. Frame IDs are unique for a given tab and process.
  */
    frameId: number
  /**
   * ID of frame that wraps the frame. Set to -1 of no parent frame exists.
  */
    parentFrameId: number
  /**
   * The time when the browser was about to start the navigation, in milliseconds since the epoch.
  */
    timeStamp: number

  }) => void)>;
    const onCommitted: EventHandler<  /**
 * Fired when a navigation is committed. The document (and the resources it refers to, such as images and subframes) might still be downloading, but at least part of the document has been received from the server and the browser has decided to switch to the new document.
  */
  ((details: {
    /**
   * The ID of the tab in which the navigation occurs.
  */
    tabId: number
    url: string
  /**
   * 0 indicates the navigation happens in the tab content window; a positive value indicates navigation in a subframe. Frame IDs are unique within a tab.
  */
    frameId: number
  /**
   * Cause of the navigation.
  */
    transitionType: TransitionType
  /**
   * A list of transition qualifiers.
  */
    transitionQualifiers: TransitionQualifier[]
  /**
   * The time when the navigation was committed, in milliseconds since the epoch.
  */
    timeStamp: number

  }) => void)>;
    const onDOMContentLoaded: EventHandler<  /**
 * Fired when the page's DOM is fully constructed, but the referenced resources may not finish loading.
  */
  ((details: {
    /**
   * The ID of the tab in which the navigation occurs.
  */
    tabId: number
    url: string
  /**
   * 0 indicates the navigation happens in the tab content window; a positive value indicates navigation in a subframe. Frame IDs are unique within a tab.
  */
    frameId: number
  /**
   * The time when the page's DOM was fully constructed, in milliseconds since the epoch.
  */
    timeStamp: number

  }) => void)>;
    const onCompleted: EventHandler<  /**
 * Fired when a document, including the resources it refers to, is completely loaded and initialized.
  */
  ((details: {
    /**
   * The ID of the tab in which the navigation occurs.
  */
    tabId: number
    url: string
  /**
   * 0 indicates the navigation happens in the tab content window; a positive value indicates navigation in a subframe. Frame IDs are unique within a tab.
  */
    frameId: number
  /**
   * The time when the document finished loading, in milliseconds since the epoch.
  */
    timeStamp: number

  }) => void)>;
    const onErrorOccurred: EventHandler<  /**
 * Fired when an error occurs and the navigation is aborted. This can happen if either a network error occurred, or the user aborted the navigation.
  */
  ((details: {
    /**
   * The ID of the tab in which the navigation occurs.
  */
    tabId: number
    url: string
  /**
   * 0 indicates the navigation happens in the tab content window; a positive value indicates navigation in a subframe. Frame IDs are unique within a tab.
  */
    frameId: number
  /**
   * The time when the error occurred, in milliseconds since the epoch.
  */
    timeStamp: number

  }) => void)>;
    const onCreatedNavigationTarget: EventHandler<  /**
 * Fired when a new window, or a new tab in an existing window, is created to host a navigation.
  */
  ((details: {
    /**
   * The ID of the tab in which the navigation is triggered.
  */
    sourceTabId: number
  /**
   * The ID of the process runs the renderer for the source tab.
  */
    sourceProcessId: number
  /**
   * The ID of the frame with sourceTabId in which the navigation is triggered. 0 indicates the main frame.
  */
    sourceFrameId: number
  /**
   * The URL to be opened in the new window.
  */
    url: string
  /**
   * The ID of the tab in which the url is opened
  */
    tabId: number
  /**
   * The time when the browser was about to create a new view, in milliseconds since the epoch.
  */
    timeStamp: number

  }) => void)>;
    const onReferenceFragmentUpdated: EventHandler<  /**
 * Fired when the reference fragment of a frame was updated. All future events for that frame will use the updated URL.
  */
  ((details: {
    /**
   * The ID of the tab in which the navigation occurs.
  */
    tabId: number
    url: string
  /**
   * 0 indicates the navigation happens in the tab content window; a positive value indicates navigation in a subframe. Frame IDs are unique within a tab.
  */
    frameId: number
  /**
   * Cause of the navigation.
  */
    transitionType: TransitionType
  /**
   * A list of transition qualifiers.
  */
    transitionQualifiers: TransitionQualifier[]
  /**
   * The time when the navigation was committed, in milliseconds since the epoch.
  */
    timeStamp: number

  }) => void)>;
    const onTabReplaced: EventHandler<  /**
 * Fired when the contents of the tab is replaced by a different (usually previously pre-rendered) tab.
  */
  ((details: {
    /**
   * The ID of the tab that was replaced.
  */
    replacedTabId: number
  /**
   * The ID of the tab that replaced the old tab.
  */
    tabId: number
  /**
   * The time when the replacement happened, in milliseconds since the epoch.
  */
    timeStamp: number

  }) => void)>;
    const onHistoryStateUpdated: EventHandler<  /**
 * Fired when the frame's history was updated to a new URL. All future events for that frame will use the updated URL.
  */
  ((details: {
    /**
   * The ID of the tab in which the navigation occurs.
  */
    tabId: number
    url: string
  /**
   * 0 indicates the navigation happens in the tab content window; a positive value indicates navigation in a subframe. Frame IDs are unique within a tab.
  */
    frameId: number
  /**
   * Cause of the navigation.
  */
    transitionType: TransitionType
  /**
   * A list of transition qualifiers.
  */
    transitionQualifiers: TransitionQualifier[]
  /**
   * The time when the navigation was committed, in milliseconds since the epoch.
  */
    timeStamp: number

  }) => void)>;
}

  /**
 * Use the `browser.browserSettings` API to control global settings of the browser.
  */
declare namespace browser.browserSettings {
  /**
 * How images should be animated in the browser.
  */
  /**
 * How images should be animated in the browser.
  */
  type ImageAnimationBehavior = string;
  /**
 * After which mouse event context menus should popup.
  */
  /**
 * After which mouse event context menus should popup.
  */
  type ContextMenuMouseEvent = string;
  /**
 * Color management mode.
  */
  /**
 * Color management mode.
  */
  type ColorManagementMode = string;
  /**
 * Allows or disallows pop-up windows from opening in response to user events.
  */
const allowPopupsForUserEvents:  types.Setting;
  /**
 * Enables or disables the browser cache.
  */
const cacheEnabled:  types.Setting;
  /**
 * This boolean setting controls whether the selected tab can be closed with a double click.
  */
const closeTabsByDoubleClick:  types.Setting;
  /**
 * Controls after which mouse event context menus popup. This setting's value is of type ContextMenuMouseEvent, which has possible values of `mouseup` and `mousedown`.
  */
const contextMenuShowEvent:  types.Setting;
  /**
 * Returns whether the FTP protocol is enabled. Read-only.
  */
const ftpProtocolEnabled:  types.Setting;
  /**
 * Returns the value of the overridden home page. Read-only.
  */
const homepageOverride:  types.Setting;
  /**
 * Controls the behaviour of image animation in the browser. This setting's value is of type ImageAnimationBehavior, defaulting to `normal`.
  */
const imageAnimationBehavior:  types.Setting;
  /**
 * Returns the value of the overridden new tab page. Read-only.
  */
const newTabPageOverride:  types.Setting;
  /**
 * Controls where new tabs are opened. `afterCurrent` will open all new tabs next to the current tab, `relatedAfterCurrent` will open only related tabs next to the current tab, and `atEnd` will open all tabs at the end of the tab strip. The default is `relatedAfterCurrent`.
  */
const newTabPosition:  types.Setting;
  /**
 * This boolean setting controls whether bookmarks are opened in the current tab or in a new tab.
  */
const openBookmarksInNewTabs:  types.Setting;
  /**
 * This boolean setting controls whether search results are opened in the current tab or in a new tab.
  */
const openSearchResultsInNewTabs:  types.Setting;
  /**
 * This boolean setting controls whether urlbar results are opened in the current tab or in a new tab.
  */
const openUrlbarResultsInNewTabs:  types.Setting;
  /**
 * Disables webAPI notifications.
  */
const webNotificationsDisabled:  types.Setting;
  /**
 * This setting controls whether the user-chosen colors override the page's colors.
  */
const overrideDocumentColors:  types.Setting;
  /**
 * This setting controls whether a light or dark color scheme overrides the page's preferred color scheme.
  */
const overrideContentColorScheme:  types.Setting;
  /**
 * This setting controls whether the document's fonts are used.
  */
const useDocumentFonts:  types.Setting;
  /**
 * This boolean setting controls whether zoom is applied to the full page or to text only.
  */
const zoomFullPage:  types.Setting;
  /**
 * This boolean setting controls whether zoom is applied on a per-site basis or to the current tab only. If privacy.resistFingerprinting is true, this setting has no effect and zoom is applied to the current tab only.
  */
const zoomSiteSpecific:  types.Setting;
}

  /**
 * Use the `browserSettings.colorManagement` API to query and set items related to color management.
  */
declare namespace browser.browserSettings.colorManagement {
  /**
 * This setting controls the mode used for color management and must be a string from $(ref:browserSettings.ColorManagementMode)
  */
const mode:  types.Setting;
  /**
 * This boolean setting controls whether or not native sRGB color management is used.
  */
const useNativeSRGB:  types.Setting;
  /**
 * This boolean setting controls whether or not the WebRender compositor is used.
  */
const useWebRenderCompositor:  types.Setting;
}

  /**
 * Monitor extension activity
  */
declare namespace browser.activityLog {
    const onExtensionActivity: EventHandler<  /**
 * Receives an activityItem for each logging event.
  */
  ((details: {
    /**
   * The date string when this call is triggered.
  */
    timeStamp:  extensionTypes.Date
  /**
   * The type of log entry.  api_call is a function call made by the extension and api_event is an event callback to the extension.  content_script is logged when a content script is injected.
  */
    type: 'api_call'
 | 'api_event'
 | 'content_script'
 | 'user_script'
  /**
   * The type of view where the activity occurred.  Content scripts will not have a viewType.
  */
    viewType?: 'background'
 | 'popup'
 | 'sidebar'
 | 'tab'
 | 'devtools_page'
 | 'devtools_panel'
  /**
   * The name of the api call or event, or the script url if this is a content or user script event.
  */
    name: string
    data: {
    /**
   * A list of arguments passed to the call.
  */
    args?: any[]
  /**
   * The result of the call.
  */
    result?: /* "unknown" undefined */ object
  /**
   * The tab associated with this event if it is a tab or content script.
  */
    tabId?: number
  /**
   * If the type is content_script, this is the url of the script that was injected.
  */
    url?: string

  }

  }) => void)>;
}

declare namespace browser.alarms {
  export interface Alarm {
  /**
   * Name of this alarm.
  */
    name: string
  /**
   * Time when the alarm is scheduled to fire, in milliseconds past the epoch.
  */
    scheduledTime: number
  /**
   * When present, signals that the alarm triggers periodically after so many minutes.
  */
    periodInMinutes?: number

  }

  /**
 * Creates an alarm. After the delay is expired, the onAlarm event is fired. If there is another alarm with the same name (or no name if none is specified), it will be cancelled and replaced by this alarm.
  */
  function create(/**
 * Optional name to identify this alarm. Defaults to the empty string.
  */

name: string, /**
 * Details about the alarm. The alarm first fires either at 'when' milliseconds past the epoch (if 'when' is provided), after 'delayInMinutes' minutes from the current time (if 'delayInMinutes' is provided instead), or after 'periodInMinutes' minutes from the current time (if only 'periodInMinutes' is provided). Users should never provide both 'when' and 'delayInMinutes'. If 'periodInMinutes' is provided, then the alarm recurs repeatedly after that many minutes.
  */

alarmInfo: {
    /**
   * Time when the alarm is scheduled to first fire, in milliseconds past the epoch.
  */
    when?: number
  /**
   * Number of minutes from the current time after which the alarm should first fire.
  */
    delayInMinutes?: number
  /**
   * Number of minutes after which the alarm should recur repeatedly.
  */
    periodInMinutes?: number

  }): void;
  function create(/**
 * Details about the alarm. The alarm first fires either at 'when' milliseconds past the epoch (if 'when' is provided), after 'delayInMinutes' minutes from the current time (if 'delayInMinutes' is provided instead), or after 'periodInMinutes' minutes from the current time (if only 'periodInMinutes' is provided). Users should never provide both 'when' and 'delayInMinutes'. If 'periodInMinutes' is provided, then the alarm recurs repeatedly after that many minutes.
  */

alarmInfo: {
    /**
   * Time when the alarm is scheduled to first fire, in milliseconds past the epoch.
  */
    when?: number
  /**
   * Number of minutes from the current time after which the alarm should first fire.
  */
    delayInMinutes?: number
  /**
   * Number of minutes after which the alarm should recur repeatedly.
  */
    periodInMinutes?: number

  }): void;
  /**
 * Retrieves details about the specified alarm.
  */
  function get(/**
 * The name of the alarm to get. Defaults to the empty string.
  */

name?: string): Promise<Alarm>;
  /**
 * Gets an array of all the alarms.
  */
  function getAll(): Promise<Alarm[]>;
  /**
 * Clears the alarm with the given name.
  */
  function clear(/**
 * The name of the alarm to clear. Defaults to the empty string.
  */

name?: string): Promise<boolean>;
  /**
 * Clears all alarms.
  */
  function clearAll(): Promise<boolean>;
    const onAlarm: EventHandler<  /**
 * Fired when an alarm has expired. Useful for transient background pages.
  */
  ((/**
 * The alarm that has expired.
  */

name: Alarm) => void)>;
}

  /**
 * Use the `chrome.browsingData` API to remove browsing data from a user's local profile.
  */
declare namespace browser.browsingData {
  /**
 * Options that determine exactly what data will be removed.
  */
  export interface RemovalOptions {
  /**
   * Remove data accumulated on or after this date, represented in milliseconds since the epoch (accessible via the `getTime` method of the JavaScript `Date` object). If absent, defaults to 0 (which would remove all browsing data).
  */
    since?:  extensionTypes.Date
  /**
   * Only remove data associated with these hostnames (only applies to cookies and localStorage).
  */
    hostnames?: string[]
  /**
   * Only remove data associated with this specific cookieStoreId.
  */
    cookieStoreId?: string
  /**
   * An object whose properties specify which origin types ought to be cleared. If this object isn't specified, it defaults to clearing only "unprotected" origins. Please ensure that you *really* want to remove application data before adding 'protectedWeb' or 'extensions'.
  */
    originTypes?: {
    /**
   * Normal websites.
  */
    unprotectedWeb?: boolean
  /**
   * Websites that have been installed as hosted applications (be careful!).
  */
    protectedWeb?: boolean
  /**
   * Extensions and packaged applications a user has installed (be _really_ careful!).
  */
    extension?: boolean

  }

  }

  /**
 * A set of data types. Missing data types are interpreted as `false`.
  */
  export interface DataTypeSet {
  /**
   * The browser's cache. Note: when removing data, this clears the *entire* cache: it is not limited to the range you specify.
  */
    cache?: boolean
  /**
   * The browser's cookies.
  */
    cookies?: boolean
  /**
   * The browser's download list.
  */
    downloads?: boolean
  /**
   * The browser's stored form data.
  */
    formData?: boolean
  /**
   * The browser's history.
  */
    history?: boolean
  /**
   * Websites' IndexedDB data.
  */
    indexedDB?: boolean
  /**
   * Websites' local storage data.
  */
    localStorage?: boolean
  /**
   * Server-bound certificates.
  */
    serverBoundCertificates?: boolean
  /**
   * Stored passwords.
  */
    passwords?: boolean
  /**
   * Plugins' data.
  */
    pluginData?: boolean
  /**
   * Service Workers.
  */
    serviceWorkers?: boolean

  }

  /**
 * Reports which types of data are currently selected in the 'Clear browsing data' settings UI.  Note: some of the data types included in this API are not available in the settings UI, and some UI settings control more than one data type listed here.
  */
  function settings(): Promise<{
      options: RemovalOptions
  /**
   * All of the types will be present in the result, with values of `true` if they are both selected to be removed and permitted to be removed, otherwise `false`.
  */
    dataToRemove: DataTypeSet
  /**
   * All of the types will be present in the result, with values of `true` if they are permitted to be removed (e.g., by enterprise policy) and `false` if not.
  */
    dataRemovalPermitted: DataTypeSet

  }>;
  /**
 * Clears various types of browsing data stored in a user's profile.
  */
  function remove(options: RemovalOptions, /**
 * The set of data types to remove.
  */

dataToRemove: DataTypeSet): Promise<void | null>;
  /**
 * Clears websites' appcache data.
  */
  function removeAppcache(options: RemovalOptions): Promise<void | null>;
  /**
 * Clears the browser's cache.
  */
  function removeCache(options: RemovalOptions): Promise<void | null>;
  /**
 * Clears the browser's cookies and server-bound certificates modified within a particular timeframe.
  */
  function removeCookies(options: RemovalOptions): Promise<void | null>;
  /**
 * Clears the browser's list of downloaded files (*not* the downloaded files themselves).
  */
  function removeDownloads(options: RemovalOptions): Promise<void | null>;
  /**
 * Clears websites' file system data.
  */
  function removeFileSystems(options: RemovalOptions): Promise<void | null>;
  /**
 * Clears the browser's stored form data (autofill).
  */
  function removeFormData(options: RemovalOptions): Promise<void | null>;
  /**
 * Clears the browser's history.
  */
  function removeHistory(options: RemovalOptions): Promise<void | null>;
  /**
 * Clears websites' IndexedDB data.
  */
  function removeIndexedDB(options: RemovalOptions): Promise<void | null>;
  /**
 * Clears websites' local storage data.
  */
  function removeLocalStorage(options: RemovalOptions): Promise<void | null>;
  /**
 * Clears plugins' data.
  */
  function removePluginData(options: RemovalOptions): Promise<void | null>;
  /**
 * Clears the browser's stored passwords.
  */
  function removePasswords(options: RemovalOptions): Promise<void | null>;
  /**
 * Clears websites' WebSQL data.
  */
  function removeWebSQL(options: RemovalOptions): Promise<void | null>;
}

declare namespace browser.contentScripts {
  /**
 * Details of a content script registered programmatically
  */
  export interface RegisteredContentScriptOptions {
    matches: manifest.MatchPattern[]
    excludeMatches?: manifest.MatchPattern[]
    includeGlobs?: string[]
    excludeGlobs?: string[]
  /**
   * The list of CSS files to inject
  */
    css?: extensionTypes.ExtensionFileOrCode[]
  /**
   * The list of JS files to inject
  */
    js?: extensionTypes.ExtensionFileOrCode[]
  /**
   * If allFrames is `true`, implies that the JavaScript or CSS should be injected into all frames of current page. By default, it's `false` and is only injected into the top frame.
  */
    allFrames?: boolean
  /**
   * If matchAboutBlank is true, then the code is also injected in about:blank and about:srcdoc frames if your extension has access to its parent document. Ignored if matchOriginAsFallback is specified. By default it is `false`.
  */
    matchAboutBlank?: boolean
  /**
   * If matchOriginAsFallback is true, then the code is also injected in about:, data:, blob: when their origin matches the pattern in 'matches', even if the actual document origin is opaque (due to the use of CSP sandbox or iframe sandbox). Match patterns in 'matches' must specify a wildcard path glob. By default it is `false`.
  */
    matchOriginAsFallback?: boolean
  /**
   * The soonest that the JavaScript or CSS will be injected into the tab. Defaults to "document_idle".
  */
    runAt?:  extensionTypes.RunAt
  /**
   * The JavaScript world for a script to execute within. Defaults to "ISOLATED".
  */
    world?:  extensionTypes.ExecutionWorld
  /**
   * limit the set of matched tabs to those that belong to the given cookie store id
  */
    cookieStoreId?: string[] | string

  }

  /**
 * An object that represents a content script registered programmatically
  */
  export interface RegisteredContentScript {
  /**
 * Unregister a content script registered programmatically
  */

  unregister(): Promise<any>;


  }

  /**
 * Register a content script programmatically
  */
  function register(contentScriptOptions: RegisteredContentScriptOptions): Promise<any>;
}

  /**
 * The `browser.extension` API has utilities that can be used by any extension page. It includes support for exchanging messages between an extension and its content scripts or between extensions, as described in detail in $(topic:messaging)[Message Passing].
  */
declare namespace browser.extension {
  /**
 * The type of extension view.
  */
  /**
 * The type of extension view.
  */
  type ViewType = string;
  /**
 * Converts a relative path within an extension install directory to a fully-qualified URL.
  */
  function getURL(/**
 * A path to a resource within an extension expressed relative to its install directory.
  */

path: string): string;
  /**
 * Returns an array of the JavaScript 'window' objects for each of the pages running inside the current extension.
  */
  function getViews(fetchProperties?: {
    /**
   * The type of view to get. If omitted, returns all views (including background pages and tabs). Valid values: 'tab', 'popup', 'sidebar'.
  */
    type?: ViewType
  /**
   * The window to restrict the search to. If omitted, returns all views.
  */
    windowId?: number
  /**
   * Find a view according to a tab id. If this field is omitted, returns all views.
  */
    tabId?: number

  }): [];
  /**
 * Returns the JavaScript 'window' object for the background page running inside the current extension. Returns null if the extension has no background page.
  */
  function getBackgroundPage(): object;
  /**
 * Retrieves the state of the extension's access to Incognito-mode (as determined by the user-controlled 'Allowed in Incognito' checkbox.
  */
  function isAllowedIncognitoAccess(): Promise<boolean>;
  /**
 * Retrieves the state of the extension's access to the 'file://' scheme (as determined by the user-controlled 'Allow access to File URLs' checkbox.
  */
  function isAllowedFileSchemeAccess(): Promise<boolean>;
  /**
 * Sets the value of the ap CGI parameter used in the extension's update URL.  This value is ignored for extensions that are hosted in the browser vendor's store.
  */
  function setUpdateUrlData(data: string): void;
    const onRequest: EventHandler<  /**
 * Fired when a request is sent from either an extension process or a content script.
  */
  ((/**
 * The request sent by the calling script.
  */

request: any, sender:  runtime.MessageSender, /**
 * Function to call (at most once) when you have a response. The argument should be any JSON-ifiable object, or undefined if there is no response. If you have more than one `onRequest` listener in the same document, then only one may send a response.
  */

sendResponse: /* or any?  */   () => void , 
 /* x7 */) => void) | 
  ((sender:  runtime.MessageSender, /**
 * Function to call (at most once) when you have a response. The argument should be any JSON-ifiable object, or undefined if there is no response. If you have more than one `onRequest` listener in the same document, then only one may send a response.
  */

sendResponse: /* or any?  */   () => void , 
 /* x7 */) => void)>;
    const onRequestExternal: EventHandler<  /**
 * Fired when a request is sent from another extension.
  */
  ((/**
 * The request sent by the calling script.
  */

request: any, sender:  runtime.MessageSender, /**
 * Function to call when you have a response. The argument should be any JSON-ifiable object, or undefined if there is no response.
  */

sendResponse: /* or any?  */   () => void , 
 /* x7 */) => void) | 
  ((sender:  runtime.MessageSender, /**
 * Function to call when you have a response. The argument should be any JSON-ifiable object, or undefined if there is no response.
  */

sendResponse: /* or any?  */   () => void , 
 /* x7 */) => void)>;
  /**
 * Set for the lifetime of a callback if an ansychronous extension api has resulted in an error. If no error has occured lastError will be <var>undefined</var>.
  */
  /**
 * True for content scripts running inside incognito tabs, and for extension pages running inside an incognito process. The latter only applies to extensions with 'split' incognito_behavior.
  */
}

  /**
 * Use the `browser.storage` API to store, retrieve, and track changes to user data.
  */
declare namespace browser.storage {
  export interface StorageChange {
  /**
   * The old value of the item, if there was an old value.
  */
    oldValue?: any
  /**
   * The new value of the item, if there is a new value.
  */
    newValue?: any

  }

  export interface StorageArea {
  /**
 * Gets one or more items from storage.
  */

  get(/**
 * A single key to get, list of keys to get, or a dictionary specifying default values (see description of the object).  An empty list or object will return an empty result object.  Pass in `null` to get the entire contents of storage.
  */

keys?: string | string[] | /* "unknown" undefined */ object): Promise</* "unknown" undefined */ object>;

  /**
 * Gets the amount of space (in bytes) being used by one or more items.
  */

  getBytesInUse(/**
 * A single key or list of keys to get the total usage for. An empty list will return 0. Pass in `null` to get the total usage of all of storage.
  */

keys?: string | string[]): Promise<number>;

  /**
 * Sets multiple items.
  */

  set(/**
 * <p>An object which gives each key/value pair to update storage with. Any other key/value pairs in storage will not be affected.</p><p>Primitive values such as numbers will serialize as expected. Values with a `typeof` `"object"` and `"function"` will typically serialize to `{}`, with the exception of `Array` (serializes as expected), `Date`, and `Regex` (serialize using their `String` representation).</p>
  */

items: /* "unknown" undefined */ object): Promise<void | null>;

  /**
 * Removes one or more items from storage.
  */

  remove(/**
 * A single key or a list of keys for items to remove.
  */

keys: string | string[]): Promise<void | null>;

  /**
 * Removes all items from storage.
  */

  clear(): Promise<void | null>;


  }

  export interface StorageAreaSync {
  /**
 * Gets one or more items from storage.
  */

  get(/**
 * A single key to get, list of keys to get, or a dictionary specifying default values (see description of the object).  An empty list or object will return an empty result object.  Pass in `null` to get the entire contents of storage.
  */

keys?: string | string[] | /* "unknown" undefined */ object): Promise</* "unknown" undefined */ object>;

  /**
 * Gets the amount of space (in bytes) being used by one or more items.
  */

  getBytesInUse(/**
 * A single key or list of keys to get the total usage for. An empty list will return 0. Pass in `null` to get the total usage of all of storage.
  */

keys?: string | string[]): Promise<number>;

  /**
 * Sets multiple items.
  */

  set(/**
 * <p>An object which gives each key/value pair to update storage with. Any other key/value pairs in storage will not be affected.</p><p>Primitive values such as numbers will serialize as expected. Values with a `typeof` `"object"` and `"function"` will typically serialize to `{}`, with the exception of `Array` (serializes as expected), `Date`, and `Regex` (serialize using their `String` representation).</p>
  */

items: /* "unknown" undefined */ object): Promise<void | null>;

  /**
 * Removes one or more items from storage.
  */

  remove(/**
 * A single key or a list of keys for items to remove.
  */

keys: string | string[]): Promise<void | null>;

  /**
 * Removes all items from storage.
  */

  clear(): Promise<void | null>;


  }

    const onChanged: EventHandler<  /**
 * Fired when one or more items change.
  */
  ((/**
 * Object mapping each key that changed to its corresponding $(ref:storage.StorageChange) for that item.
  */

changes: /* "unknown" undefined */ object, /**
 * The name of the storage area (`"sync"`, `"local"` or `"managed"`) the changes are for.
  */

areaName: string) => void)>;
  /**
 * Items in the `sync` storage area are synced by the browser.
  */
const sync: StorageAreaSync;
  /**
 * Items in the `local` storage area are local to each machine.
  */
const local: StorageArea;
  /**
 * Items in the `managed` storage area are set by administrators or native applications, and are read-only for the extension; trying to modify this namespace results in an error.
  */
const managed: StorageArea;
  /**
 * Items in the `session` storage area are kept in memory, and only until the either browser or extension is closed or reloaded.
  */
const session: StorageArea;
}

  /**
 * Use the `browser.webRequest` API to observe and analyze traffic and to intercept, block, or modify requests in-flight.
  */
declare namespace browser.webRequest {
  type ResourceType = string;
  type OnBeforeRequestOptions = string;
  type OnBeforeSendHeadersOptions = string;
  type OnSendHeadersOptions = string;
  type OnHeadersReceivedOptions = string;
  type OnAuthRequiredOptions = string;
  type OnResponseStartedOptions = string;
  type OnBeforeRedirectOptions = string;
  type OnCompletedOptions = string;
  /**
 * An object describing filters to apply to webRequest events.
  */
  export interface RequestFilter {
  /**
   * A list of URLs or URL patterns. Requests that cannot match any of the URLs will be filtered out.
  */
    urls: string[]
  /**
   * A list of request types. Requests that cannot match any of the types will be filtered out.
  */
    types?: ResourceType[]
    tabId?: number
    windowId?: number
  /**
   * If provided, requests that do not match the incognito state will be filtered out.
  */
    incognito?: boolean

  }

  /**
 * An array of HTTP headers. Each header is represented as a dictionary containing the keys `name` and either `value` or `binaryValue`.
  */
  type HttpHeaders = {
    /**
   * Name of the HTTP header.
  */
    name: string
  /**
   * Value of the HTTP header if it can be represented by UTF-8.
  */
    value?: string
  /**
   * Value of the HTTP header if it cannot be represented by UTF-8, stored as individual byte values (0..255).
  */
    binaryValue?: number[]

  }[];
  /**
 * Returns value for event handlers that have the 'blocking' extraInfoSpec applied. Allows the event handler to modify network requests.
  */
  export interface BlockingResponse {
  /**
   * If true, the request is cancelled. Used in onBeforeRequest, this prevents the request from being sent.
  */
    cancel?: boolean
  /**
   * Only used as a response to the onBeforeRequest and onHeadersReceived events. If set, the original request is prevented from being sent/completed and is instead redirected to the given URL. Redirections to non-HTTP schemes such as data: are allowed. Redirects initiated by a redirect action use the original request method for the redirect, with one exception: If the redirect is initiated at the onHeadersReceived stage, then the redirect will be issued using the GET method.
  */
    redirectUrl?: string
  /**
   * Only used as a response to the onBeforeRequest event. If set, the original request is prevented from being sent/completed and is instead upgraded to a secure request.  If any extension returns `redirectUrl` during onBeforeRequest, `upgradeToSecure` will have no affect.
  */
    upgradeToSecure?: boolean
  /**
   * Only used as a response to the onBeforeSendHeaders event. If set, the request is made with these request headers instead.
  */
    requestHeaders?: HttpHeaders
  /**
   * Only used as a response to the onHeadersReceived event. If set, the server is assumed to have responded with these response headers instead. Only return `responseHeaders` if you really want to modify the headers in order to limit the number of conflicts (only one extension may modify `responseHeaders` for each request).
  */
    responseHeaders?: HttpHeaders
  /**
   * Only used as a response to the onAuthRequired event. If set, the request is made using the supplied credentials.
  */
    authCredentials?: {
      username: string
    password: string

  }

  }

  /**
 * Contains the certificate properties of the request if it is a secure request.
  */
  export interface CertificateInfo {
    subject: string
    issuer: string
  /**
   * Contains start and end timestamps.
  */
    validity: {
      start: number
    end: number

  }
    fingerprint: {
      sha1: string
    sha256: string

  }
    serialNumber: string
    isBuiltInRoot: boolean
    subjectPublicKeyInfoDigest: {
      sha256: string

  }
    rawDER?: number[]

  }

  type CertificateTransparencyStatus = string;
  type TransportWeaknessReasons = string;
  /**
 * Contains the security properties of the request (ie. SSL/TLS information).
  */
  export interface SecurityInfo {
    state: 'insecure'
 | 'weak'
 | 'broken'
 | 'secure'
  /**
   * Error message if state is "broken"
  */
    errorMessage?: string
  /**
   * Protocol version if state is "secure"
  */
    protocolVersion?: 'TLSv1'
 | 'TLSv1.1'
 | 'TLSv1.2'
 | 'TLSv1.3'
 | 'unknown'
  /**
   * The cipher suite used in this request if state is "secure".
  */
    cipherSuite?: string
  /**
   * The key exchange algorithm used in this request if state is "secure".
  */
    keaGroupName?: string
  /**
   * The length (in bits) of the secret key.
  */
    secretKeyLength?: number
  /**
   * The signature scheme used in this request if state is "secure".
  */
    signatureSchemeName?: string
  /**
   * Certificate data if state is "secure".  Will only contain one entry unless `certificateChain` is passed as an option.
  */
    certificates: CertificateInfo[]
  /**
   * The type of certificate error that was overridden for this connection, if any.
  */
    overridableErrorCategory?: 'trust_error'
 | 'domain_mismatch'
 | 'expired_or_not_yet_valid'
  /**
   * The domain name does not match the certificate domain.
  */
    isDomainMismatch?: boolean
  /**
   * The certificate is either expired or is not yet valid.  See `CertificateInfo.validity` for start and end dates.
  */
    isNotValidAtThisTime?: boolean
    isUntrusted?: boolean
    isExtendedValidation?: boolean
  /**
   * Certificate transparency compliance per RFC 6962.  See `https://www.certificate-transparency.org/what-is-ct` for more information.
  */
    certificateTransparencyStatus?: CertificateTransparencyStatus
  /**
   * True if host uses Strict Transport Security and state is "secure".
  */
    hsts?: boolean
  /**
   * True if host uses Public Key Pinning and state is "secure".
  */
    hpkp?: string
  /**
   * list of reasons that cause the request to be considered weak, if state is "weak"
  */
    weaknessReasons?: TransportWeaknessReasons[]
  /**
   * True if the TLS connection used Encrypted Client Hello.
  */
    usedEch?: boolean
  /**
   * True if the TLS connection used Delegated Credentials.
  */
    usedDelegatedCredentials?: boolean
  /**
   * True if the TLS connection made OCSP requests.
  */
    usedOcsp?: boolean
  /**
   * True if the TLS connection used a privacy-preserving DNS transport like DNS-over-HTTPS.
  */
    usedPrivateDns?: boolean

  }

  /**
 * Contains data uploaded in a URL request.
  */
  export interface UploadData {
  /**
   * An ArrayBuffer with a copy of the data.
  */
    bytes?: any
  /**
   * A string with the file's path and name.
  */
    file?: string

  }

  /**
 * Tracking flags that match our internal tracking classification
  */
  /**
 * Tracking flags that match our internal tracking classification
  */
  type UrlClassificationFlags = string;
  /**
 * If the request has been classified this is an array of $(ref:UrlClassificationFlags).
  */
  type UrlClassificationParty = UrlClassificationFlags[];
  export interface UrlClassification {
  /**
   * Classification flags if the request has been classified and it is first party.
  */
    firstParty: UrlClassificationParty
  /**
   * Classification flags if the request has been classified and it or its window hierarchy is third party.
  */
    thirdParty: UrlClassificationParty

  }

  /**
 * Needs to be called when the behavior of the webRequest handlers has changed to prevent incorrect handling due to caching. This function call is expensive. Don't call it often.
  */
  function handlerBehaviorChanged(): Promise<void | null>;
  /**
 * ...
  */
  function filterResponseData(requestId: string): object;
  /**
 * Retrieves the security information for the request.  Returns a promise that will resolve to a SecurityInfo object.
  */
  function getSecurityInfo(requestId: string, options?: {
    /**
   * Include the entire certificate chain.
  */
    certificateChain?: boolean
  /**
   * Include raw certificate data for processing by the extension.
  */
    rawDER?: boolean

  }): Promise<any>;
    const onBeforeRequest: EventHandler<  /**
 * Fired when a request is about to occur.
  */
  ((details: {
    /**
   * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
  */
    requestId: string
    url: string
  /**
   * Standard HTTP method.
  */
    method: string
  /**
   * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
  */
    frameId: number
  /**
   * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
  */
    parentFrameId: number
  /**
   * True for private browsing requests.
  */
    incognito?: boolean
  /**
   * The cookie store ID of the contextual identity.
  */
    cookieStoreId?: string
  /**
   * URL of the resource that triggered this request.
  */
    originUrl?: string
  /**
   * URL of the page into which the requested resource will be loaded.
  */
    documentUrl?: string
  /**
   * Contains the HTTP request body data. Only provided if extraInfoSpec contains 'requestBody'.
  */
    requestBody?: {
    /**
   * Errors when obtaining request body data.
  */
    error?: string
  /**
   * If the request method is POST and the body is a sequence of key-value pairs encoded in UTF8, encoded as either multipart/form-data, or application/x-www-form-urlencoded, this dictionary is present and for each key contains the list of all values for that key. If the data is of another media type, or if it is malformed, the dictionary is not present. An example value of this dictionary is {'key': ['value1', 'value2']}.
  */
    formData?: {
  
  }
  /**
   * If the request method is PUT or POST, and the body is not already parsed in formData, then the unparsed request body elements are contained in this array.
  */
    raw?: UploadData[]

  }
  /**
   * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
  */
    tabId: number
  /**
   * How the requested resource will be used.
  */
    type: ResourceType
  /**
   * The time when this signal is triggered, in milliseconds since the epoch.
  */
    timeStamp: number
  /**
   * Tracking classification if the request has been classified.
  */
    urlClassification?: UrlClassification
  /**
   * Indicates if this request and its content window hierarchy is third party.
  */
    thirdParty: boolean

  }) => undefined)>;
    const onBeforeSendHeaders: EventHandler<  /**
 * Fired before sending an HTTP request, once the request headers are available. This may occur after a TCP connection is made to the server, but before any HTTP data is sent. 
  */
  ((details: {
    /**
   * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
  */
    requestId: string
    url: string
  /**
   * Standard HTTP method.
  */
    method: string
  /**
   * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
  */
    frameId: number
  /**
   * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
  */
    parentFrameId: number
  /**
   * True for private browsing requests.
  */
    incognito?: boolean
  /**
   * The cookie store ID of the contextual identity.
  */
    cookieStoreId?: string
  /**
   * URL of the resource that triggered this request.
  */
    originUrl?: string
  /**
   * URL of the page into which the requested resource will be loaded.
  */
    documentUrl?: string
  /**
   * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
  */
    tabId: number
  /**
   * How the requested resource will be used.
  */
    type: ResourceType
  /**
   * The time when this signal is triggered, in milliseconds since the epoch.
  */
    timeStamp: number
  /**
   * The HTTP request headers that are going to be sent out with this request.
  */
    requestHeaders?: HttpHeaders
  /**
   * Tracking classification if the request has been classified.
  */
    urlClassification?: UrlClassification
  /**
   * Indicates if this request and its content window hierarchy is third party.
  */
    thirdParty: boolean

  }) => undefined)>;
    const onSendHeaders: EventHandler<  /**
 * Fired just before a request is going to be sent to the server (modifications of previous onBeforeSendHeaders callbacks are visible by the time onSendHeaders is fired).
  */
  ((details: {
    /**
   * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
  */
    requestId: string
    url: string
  /**
   * Standard HTTP method.
  */
    method: string
  /**
   * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
  */
    frameId: number
  /**
   * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
  */
    parentFrameId: number
  /**
   * True for private browsing requests.
  */
    incognito?: boolean
  /**
   * The cookie store ID of the contextual identity.
  */
    cookieStoreId?: string
  /**
   * URL of the resource that triggered this request.
  */
    originUrl?: string
  /**
   * URL of the page into which the requested resource will be loaded.
  */
    documentUrl?: string
  /**
   * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
  */
    tabId: number
  /**
   * How the requested resource will be used.
  */
    type: ResourceType
  /**
   * The time when this signal is triggered, in milliseconds since the epoch.
  */
    timeStamp: number
  /**
   * The HTTP request headers that have been sent out with this request.
  */
    requestHeaders?: HttpHeaders
  /**
   * Tracking classification if the request has been classified.
  */
    urlClassification?: UrlClassification
  /**
   * Indicates if this request and its content window hierarchy is third party.
  */
    thirdParty: boolean

  }) => void)>;
    const onHeadersReceived: EventHandler<  /**
 * Fired when HTTP response headers of a request have been received.
  */
  ((details: {
    /**
   * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
  */
    requestId: string
    url: string
  /**
   * Standard HTTP method.
  */
    method: string
  /**
   * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
  */
    frameId: number
  /**
   * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
  */
    parentFrameId: number
  /**
   * True for private browsing requests.
  */
    incognito?: boolean
  /**
   * The cookie store ID of the contextual identity.
  */
    cookieStoreId?: string
  /**
   * URL of the resource that triggered this request.
  */
    originUrl?: string
  /**
   * URL of the page into which the requested resource will be loaded.
  */
    documentUrl?: string
  /**
   * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
  */
    tabId: number
  /**
   * How the requested resource will be used.
  */
    type: ResourceType
  /**
   * The time when this signal is triggered, in milliseconds since the epoch.
  */
    timeStamp: number
  /**
   * HTTP status line of the response or the 'HTTP/0.9 200 OK' string for HTTP/0.9 responses (i.e., responses that lack a status line).
  */
    statusLine: string
  /**
   * The HTTP response headers that have been received with this response.
  */
    responseHeaders?: HttpHeaders
  /**
   * Standard HTTP status code returned by the server.
  */
    statusCode: number
  /**
   * Tracking classification if the request has been classified.
  */
    urlClassification?: UrlClassification
  /**
   * Indicates if this request and its content window hierarchy is third party.
  */
    thirdParty: boolean

  }) => undefined)>;
    const onAuthRequired: EventHandler<  /**
 * Fired when an authentication failure is received. The listener has three options: it can provide authentication credentials, it can cancel the request and display the error page, or it can take no action on the challenge. If bad user credentials are provided, this may be called multiple times for the same request.
  */
  ((details: {
    /**
   * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
  */
    requestId: string
    url: string
  /**
   * Standard HTTP method.
  */
    method: string
  /**
   * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
  */
    frameId: number
  /**
   * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
  */
    parentFrameId: number
  /**
   * True for private browsing requests.
  */
    incognito?: boolean
  /**
   * The cookie store ID of the contextual identity.
  */
    cookieStoreId?: string
  /**
   * URL of the resource that triggered this request.
  */
    originUrl?: string
  /**
   * URL of the page into which the requested resource will be loaded.
  */
    documentUrl?: string
  /**
   * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
  */
    tabId: number
  /**
   * How the requested resource will be used.
  */
    type: ResourceType
  /**
   * The time when this signal is triggered, in milliseconds since the epoch.
  */
    timeStamp: number
  /**
   * The authentication scheme, e.g. Basic or Digest.
  */
    scheme: string
  /**
   * The authentication realm provided by the server, if there is one.
  */
    realm?: string
  /**
   * The server requesting authentication.
  */
    challenger: {
      host: string
    port: number

  }
  /**
   * True for Proxy-Authenticate, false for WWW-Authenticate.
  */
    isProxy: boolean
  /**
   * The HTTP response headers that were received along with this response.
  */
    responseHeaders?: HttpHeaders
  /**
   * HTTP status line of the response or the 'HTTP/0.9 200 OK' string for HTTP/0.9 responses (i.e., responses that lack a status line) or an empty string if there are no headers.
  */
    statusLine: string
  /**
   * Standard HTTP status code returned by the server.
  */
    statusCode: number
  /**
   * Tracking classification if the request has been classified.
  */
    urlClassification?: UrlClassification
  /**
   * Indicates if this request and its content window hierarchy is third party.
  */
    thirdParty: boolean

  }, asyncCallback?: /* or any?  */   (response: void /* could not determine correct type */) => void , 
 /* x7 */) => undefined)>;
    const onResponseStarted: EventHandler<  /**
 * Fired when the first byte of the response body is received. For HTTP requests, this means that the status line and response headers are available.
  */
  ((details: {
    /**
   * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
  */
    requestId: string
    url: string
  /**
   * Standard HTTP method.
  */
    method: string
  /**
   * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
  */
    frameId: number
  /**
   * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
  */
    parentFrameId: number
  /**
   * True for private browsing requests.
  */
    incognito?: boolean
  /**
   * The cookie store ID of the contextual identity.
  */
    cookieStoreId?: string
  /**
   * URL of the resource that triggered this request.
  */
    originUrl?: string
  /**
   * URL of the page into which the requested resource will be loaded.
  */
    documentUrl?: string
  /**
   * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
  */
    tabId: number
  /**
   * How the requested resource will be used.
  */
    type: ResourceType
  /**
   * The time when this signal is triggered, in milliseconds since the epoch.
  */
    timeStamp: number
  /**
   * The server IP address that the request was actually sent to. Note that it may be a literal IPv6 address.
  */
    ip?: string
  /**
   * Indicates if this response was fetched from disk cache.
  */
    fromCache: boolean
  /**
   * Standard HTTP status code returned by the server.
  */
    statusCode: number
  /**
   * The HTTP response headers that were received along with this response.
  */
    responseHeaders?: HttpHeaders
  /**
   * HTTP status line of the response or the 'HTTP/0.9 200 OK' string for HTTP/0.9 responses (i.e., responses that lack a status line) or an empty string if there are no headers.
  */
    statusLine: string
  /**
   * Tracking classification if the request has been classified.
  */
    urlClassification?: UrlClassification
  /**
   * Indicates if this request and its content window hierarchy is third party.
  */
    thirdParty: boolean

  }) => void)>;
    const onBeforeRedirect: EventHandler<  /**
 * Fired when a server-initiated redirect is about to occur.
  */
  ((details: {
    /**
   * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
  */
    requestId: string
    url: string
  /**
   * Standard HTTP method.
  */
    method: string
  /**
   * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
  */
    frameId: number
  /**
   * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
  */
    parentFrameId: number
  /**
   * True for private browsing requests.
  */
    incognito?: boolean
  /**
   * The cookie store ID of the contextual identity.
  */
    cookieStoreId?: string
  /**
   * URL of the resource that triggered this request.
  */
    originUrl?: string
  /**
   * URL of the page into which the requested resource will be loaded.
  */
    documentUrl?: string
  /**
   * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
  */
    tabId: number
  /**
   * How the requested resource will be used.
  */
    type: ResourceType
  /**
   * The time when this signal is triggered, in milliseconds since the epoch.
  */
    timeStamp: number
  /**
   * The server IP address that the request was actually sent to. Note that it may be a literal IPv6 address.
  */
    ip?: string
  /**
   * Indicates if this response was fetched from disk cache.
  */
    fromCache: boolean
  /**
   * Standard HTTP status code returned by the server.
  */
    statusCode: number
  /**
   * The new URL.
  */
    redirectUrl: string
  /**
   * The HTTP response headers that were received along with this redirect.
  */
    responseHeaders?: HttpHeaders
  /**
   * HTTP status line of the response or the 'HTTP/0.9 200 OK' string for HTTP/0.9 responses (i.e., responses that lack a status line) or an empty string if there are no headers.
  */
    statusLine: string
  /**
   * Tracking classification if the request has been classified.
  */
    urlClassification?: UrlClassification
  /**
   * Indicates if this request and its content window hierarchy is third party.
  */
    thirdParty: boolean

  }) => void)>;
    const onCompleted: EventHandler<  /**
 * Fired when a request is completed.
  */
  ((details: {
    /**
   * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
  */
    requestId: string
    url: string
  /**
   * Standard HTTP method.
  */
    method: string
  /**
   * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
  */
    frameId: number
  /**
   * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
  */
    parentFrameId: number
  /**
   * True for private browsing requests.
  */
    incognito?: boolean
  /**
   * The cookie store ID of the contextual identity.
  */
    cookieStoreId?: string
  /**
   * URL of the resource that triggered this request.
  */
    originUrl?: string
  /**
   * URL of the page into which the requested resource will be loaded.
  */
    documentUrl?: string
  /**
   * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
  */
    tabId: number
  /**
   * How the requested resource will be used.
  */
    type: ResourceType
  /**
   * The time when this signal is triggered, in milliseconds since the epoch.
  */
    timeStamp: number
  /**
   * The server IP address that the request was actually sent to. Note that it may be a literal IPv6 address.
  */
    ip?: string
  /**
   * Indicates if this response was fetched from disk cache.
  */
    fromCache: boolean
  /**
   * Standard HTTP status code returned by the server.
  */
    statusCode: number
  /**
   * The HTTP response headers that were received along with this response.
  */
    responseHeaders?: HttpHeaders
  /**
   * HTTP status line of the response or the 'HTTP/0.9 200 OK' string for HTTP/0.9 responses (i.e., responses that lack a status line) or an empty string if there are no headers.
  */
    statusLine: string
  /**
   * Tracking classification if the request has been classified.
  */
    urlClassification: UrlClassification
  /**
   * Indicates if this request and its content window hierarchy is third party.
  */
    thirdParty: boolean
  /**
   * For http requests, the bytes transferred in the request. Only available in onCompleted.
  */
    requestSize: number
  /**
   * For http requests, the bytes received in the request. Only available in onCompleted.
  */
    responseSize: number

  }) => void)>;
    const onErrorOccurred: EventHandler<  /**
 * Fired when an error occurs.
  */
  ((details: {
    /**
   * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
  */
    requestId: string
    url: string
  /**
   * Standard HTTP method.
  */
    method: string
  /**
   * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
  */
    frameId: number
  /**
   * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
  */
    parentFrameId: number
  /**
   * True for private browsing requests.
  */
    incognito?: boolean
  /**
   * The cookie store ID of the contextual identity.
  */
    cookieStoreId?: string
  /**
   * URL of the resource that triggered this request.
  */
    originUrl?: string
  /**
   * URL of the page into which the requested resource will be loaded.
  */
    documentUrl?: string
  /**
   * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
  */
    tabId: number
  /**
   * How the requested resource will be used.
  */
    type: ResourceType
  /**
   * The time when this signal is triggered, in milliseconds since the epoch.
  */
    timeStamp: number
  /**
   * The server IP address that the request was actually sent to. Note that it may be a literal IPv6 address.
  */
    ip?: string
  /**
   * Indicates if this response was fetched from disk cache.
  */
    fromCache: boolean
  /**
   * The error description. This string is *not* guaranteed to remain backwards compatible between releases. You must not parse and act based upon its content.
  */
    error: string
  /**
   * Tracking classification if the request has been classified.
  */
    urlClassification?: UrlClassification
  /**
   * Indicates if this request and its content window hierarchy is third party.
  */
    thirdParty: boolean

  }) => void)>;
  /**
 * The maximum number of times that `handlerBehaviorChanged` can be called per 10 minute sustained interval. `handlerBehaviorChanged` is an expensive function call that shouldn't be called often.
  */
const MAX_HANDLER_BEHAVIOR_CHANGED_CALLS_PER_10_MINUTES = 20;
}

  /**
 * This API provides the ability detect the captive portal state of the users connection.
  */
declare namespace browser.captivePortal {
  /**
 * Returns the current portal state, one of `unknown`, `not_captive`, `unlocked_portal`, `locked_portal`.
  */
  function getState(): Promise<any>;
  /**
 * Returns the time difference between NOW and the last time a request was completed in milliseconds.
  */
  function getLastChecked(): Promise<any>;
    const onStateChanged: EventHandler<  /**
 * Fired when the captive portal state changes.
  */
  ((details: {
    /**
   * The current captive portal state.
  */
    state: 'unknown'
 | 'not_captive'
 | 'unlocked_portal'
 | 'locked_portal'

  }) => void)>;
    const onConnectivityAvailable: EventHandler<  /**
 * This notification will be emitted when the captive portal service has determined that we can connect to the internet. The service will pass either `captive` if there is an unlocked captive portal present, or `clear` if no captive portal was detected.
  */
  ((status: 'captive'
 | 'clear') => void)>;
  /**
 * Return the canonical captive-portal detection URL. Read-only.
  */
const canonicalURL:  types.Setting;
}

