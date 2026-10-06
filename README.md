<div align="center">

<img src=".github/logo.svg" alt="YouTube Live Comment Analyzer logo" width="120" height="120">

# YouTube Live Comment Analyzer

**A Chrome extension that ranks what a YouTube live chat is talking about, in real time.**<br>
A floating widget shows the top 10 topics, keywords, bigrams, trigrams, hashtags and mentions. Everything runs locally in your browser.

[![CI](https://github.com/obrenoalvim/youtube-live-analyzer/actions/workflows/ci.yml/badge.svg)](https://github.com/obrenoalvim/youtube-live-analyzer/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/obrenoalvim/youtube-live-analyzer?style=flat&logo=github&color=7c9cff)](https://github.com/obrenoalvim/youtube-live-analyzer/stargazers)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-4285F4?logo=googlechrome&logoColor=white)](manifest.json)
[![No dependencies](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?logo=javascript&logoColor=black)](#-technical-structure)

**English** · [Português](README.pt.md)

[Features](#-features) · [Installation](#-installation) · [How to use](#-how-to-use) · [Privacy](#-privacy-and-security) · [FAQ](#faq)

</div>

---

A Chrome extension that monitors YouTube live streams in real time and builds a live ranking of the topics people are talking about most in the chat.

## 🚀 Features

### Core features:
- **Automatic live detection**: the extension automatically detects when you're watching a YouTube live stream
- **Real-time analysis**: monitors and analyzes every comment that appears during the stream
- **Dynamic ranking**: builds a live top-10 ranking of the most-mentioned topics
- **Floating interface**: a discreet widget stays fixed on screen during analysis
- **Detailed stats**: shows the number of comments analyzed and topics identified
- **Multi-language**: supports analysis in Portuguese and English
- **Intuitive controls**: popup with controls to manage the extension

### Design elements:
- **Modern interface**: gradient design with vibrant colors and glassmorphism elements
- **Responsive widget**: adaptive interface that works across different screen sizes
- **Smooth animations**: transitions and micro-interactions for a more pleasant experience
- **Visual feedback**: real-time status indicators with colors and animations
- **Clear typography**: readable fonts with a well-defined visual hierarchy
- **Dark theme**: interface optimized for long sessions without eye strain

## 📦 Installation

### Via the Chrome Web Store (coming soon)
The extension will be available on the Chrome Web Store soon.

### Manual installation for development

1. **Clone or download** the extension files
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable "Developer mode"** in the top-right corner
4. **Click "Load unpacked"**
5. **Select the folder** containing the extension files
6. The extension installs and shows up in the toolbar

## 🔧 How to use

### Step by step:

1. **Open a YouTube live stream**: go to any live broadcast on YouTube
2. **Automatic activation**: the extension detects it's a live stream automatically
3. **Widget appears**: a discreet widget shows up in the top-right corner
4. **Analysis starts**: comments start being analyzed automatically
5. **See the ranking**: the top 10 most-discussed topics updates in real time

### Available controls:

- **●/○ button**: minimize/maximize the widget
- **Extension popup**: click the extension icon to see detailed stats
- **"Clear Data"**: resets all stats for the current session
- **"Show Widget"**: toggles the widget's visibility on the page

## 🧠 How the analysis works

### Analysis pipeline:
1. **Comment capture**: the extension monitors the live chat in real time
2. **Text normalization**: strips special characters and normalizes the text
3. **Stop-word filtering**: removes common words that don't add meaning
4. **Topic extraction**: identifies relevant words, phrases and hashtags
5. **Counting and ranking**: counts occurrences and sorts by popularity
6. **Continuous update**: the ranking refreshes every second

### Analysis types:
- **Keywords**: most-mentioned individual terms
- **Bigrams**: two-word phrases
- **Trigrams**: three-word phrases
- **Hashtags**: tags identified with #
- **Mentions**: users mentioned with @

## 🛠️ Technical structure

### Main files:
- `manifest.json` - extension configuration
- `content-script.js` - script that runs on YouTube pages
- `popup.html/js` - extension popup interface
- `background.js` - service worker for background tasks
- `styles.css` - floating widget styles

### Technologies used:
- **Manifest V3** - latest Chrome extensions version
- **Vanilla JavaScript** - no external dependencies
- **CSS3** - modern design with gradients and animations
- **Chrome Extensions API** - native browser integration
- **Mutation Observer** - real-time detection of new comments

## 🎯 Use cases

### For content creators:
- **Monitor engagement**: see which topics interest your audience the most
- **Adapt content**: shift the stream's focus based on trending topics
- **Spot trends**: discover new themes for future content

### For viewers:
- **Quick overview**: instantly understand what a live stream is about
- **Participation**: know which topics are being discussed most
- **Navigation**: gauge interest in a stream by its main topics

### For researchers:
- **Sentiment analysis**: study audience reactions in real time
- **Social trends**: identify emerging topics within a community
- **Online behavior**: analyze discussion patterns in live streams

## 🔒 Privacy and security

### Local data:
- **No external server**: all analysis happens locally in your browser
- **No data collection**: we don't collect or store personal information
- **No tracking**: we don't track your activity or browsing data

### Minimal permissions:
- **activeTab**: only to access the active tab when needed
- **storage**: to save the extension's local settings

## 🐛 Troubleshooting

### Common issues:

**The extension doesn't detect the live stream:**
- Wait a few seconds after joining the live stream
- Confirm it's actually a live broadcast (not a regular video)
- Reload the page if needed

**Widget doesn't appear:**
- Click the extension icon and then "Show Widget"
- Check that the extension is enabled at `chrome://extensions/`

**Comments aren't being analyzed:**
- Some live streams may have chat disabled
- Check that you can see the comments normally
- Reload the page and try again

### Debug:
For developers, open DevTools (F12) and check the console for the extension's logs.

## 🚀 Upcoming features

### In development:
- **Data export**: save analysis reports as JSON/CSV
- **Advanced filters**: filter by comment type or user
- **Sentiment analysis**: identify positive/negative comments
- **Session history**: save analyses from previous live streams
- **Notifications**: alerts when new topics emerge

### Future improvements:
- **More language support**: expand analysis to other languages
- **Machine learning**: better topic categorization via AI
- **API integrations**: connect with external analysis services
- **Light theme**: a light interface option alongside the dark one

## 📄 License

This extension is distributed under the MIT license. See the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Contribute code
- Improve the documentation

## 📞 Support

If you run into a problem or have suggestions:
1. Open an issue in the project's repository
2. Describe the problem in detail
3. Include your system and Chrome version

---

## FAQ

**Does it send chat data to a server?**
No. All analysis happens locally in your browser. The extension only asks for the `activeTab` and `storage` permissions.

**Does it work on regular videos?**
No. It activates on live streams and analyzes the live chat.

**Which languages does it analyze?**
Portuguese and English.

**Is it on the Chrome Web Store?**
Not yet. Load it as an unpacked extension, as shown under [Installation](#-installation).

## More developer tools by the same author

- [**media-harvest**](https://github.com/obrenoalvim/media-harvest): a DevTools panel that captures every image and video a page loads.
- [**linkedin-insights**](https://github.com/obrenoalvim/linkedin-insights): turn your LinkedIn analytics export into a dashboard.
- [**echoport**](https://github.com/obrenoalvim/echoport): a real-time localhost port scanner for developers.

---

**Built for the YouTube community**

*This extension is not affiliated with or endorsed by YouTube or Google.*

<div align="center">

If the ranking told you what the chat cares about, a ⭐ helps other people find it.

<sub>**Topics:** youtube-live · live-analysis · chrome-extension · manifest-v3 · text-analysis · real-time · nlp · vanilla-js · extension</sub>

</div>
