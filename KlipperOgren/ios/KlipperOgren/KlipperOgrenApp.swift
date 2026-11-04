import SwiftUI
import UIKit
import WebKit

// Klipper Öğren — iOS kabuğu.
// Uygulamanın tamamı "web" klasöründeki HTML/JS'tir; bu dosya onu tam ekran
// açar, ilerlemeyi telefona kaydeder, titreşim verir ve linkleri Safari'de açar.

private let appBackground = UIColor(red: 15.0 / 255.0, green: 17.0 / 255.0, blue: 21.0 / 255.0, alpha: 1.0)

@main
struct KlipperOgrenApp: App {
    var body: some Scene {
        WindowGroup {
            WebContainer()
                .ignoresSafeArea()
                .background(Color(appBackground))
                .preferredColorScheme(.dark)
        }
    }
}

// MARK: - Kalıcı kayıt (Application Support/state.json)

enum StateStore {
    private static var fileURL: URL {
        let base = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        try? FileManager.default.createDirectory(at: base, withIntermediateDirectories: true)
        return base.appendingPathComponent("state.json")
    }

    static func load() -> String {
        guard let data = try? Data(contentsOf: fileURL),
              let text = String(data: data, encoding: .utf8) else { return "" }
        return text
    }

    static func save(_ text: String) {
        let url = fileURL
        DispatchQueue.global(qos: .utility).async {
            try? text.data(using: .utf8)?.write(to: url, options: .atomic)
        }
    }

    /// Bir Swift metnini güvenli bir JavaScript string ifadesine çevirir.
    static func jsLiteral(_ text: String) -> String {
        if let data = try? JSONSerialization.data(withJSONObject: [text], options: []),
           var json = String(data: data, encoding: .utf8), json.count >= 2 {
            json.removeFirst() // [
            json.removeLast()  // ]
            return json
                .replacingOccurrences(of: "\u{2028}", with: "\\u2028")
                .replacingOccurrences(of: "\u{2029}", with: "\\u2029")
        }
        return "\"\""
    }
}

// MARK: - WebView

struct WebContainer: UIViewRepresentable {
    func makeCoordinator() -> Coordinator { Coordinator() }

    func makeUIView(context: Context) -> WKWebView {
        let controller = WKUserContentController()
        controller.add(context.coordinator, name: "native")
        let boot = "window.__NATIVE_STATE__ = " + StateStore.jsLiteral(StateStore.load()) + ";"
        controller.addUserScript(WKUserScript(source: boot, injectionTime: .atDocumentStart, forMainFrameOnly: true))

        let config = WKWebViewConfiguration()
        config.userContentController = controller
        config.websiteDataStore = WKWebsiteDataStore.default()

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.isOpaque = false
        webView.backgroundColor = appBackground
        webView.scrollView.backgroundColor = appBackground
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.scrollView.bounces = false
        webView.allowsBackForwardNavigationGestures = false
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator

        if let index = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "web") {
            webView.loadFileURL(index, allowingReadAccessTo: index.deletingLastPathComponent())
        }
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    final class Coordinator: NSObject, WKScriptMessageHandler, WKNavigationDelegate, WKUIDelegate {
        private let impact = UIImpactFeedbackGenerator(style: .light)
        private let notify = UINotificationFeedbackGenerator()

        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            guard let body = message.body as? [String: Any], let type = body["type"] as? String else { return }
            switch type {
            case "save":
                if let data = body["data"] as? String { StateStore.save(data) }
            case "haptic":
                let style = body["style"] as? String ?? "light"
                if style == "success" {
                    notify.notificationOccurred(.success)
                } else if style == "error" {
                    notify.notificationOccurred(.error)
                } else {
                    impact.impactOccurred()
                }
            case "open":
                if let s = body["url"] as? String, let url = URL(string: s) {
                    UIApplication.shared.open(url)
                }
            default:
                break
            }
        }

        // İnternet linkleri uygulamanın içinde değil Safari'de açılsın
        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction,
                     decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            if let url = navigationAction.request.url,
               let scheme = url.scheme?.lowercased(), scheme == "http" || scheme == "https",
               navigationAction.targetFrame?.isMainFrame ?? true {
                UIApplication.shared.open(url)
                decisionHandler(.cancel)
                return
            }
            decisionHandler(.allow)
        }

        func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration,
                     for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
            if let url = navigationAction.request.url { UIApplication.shared.open(url) }
            return nil
        }
    }
}
