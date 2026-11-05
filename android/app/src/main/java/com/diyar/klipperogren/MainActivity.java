package com.diyar.klipperogren;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.HapticFeedbackConstants;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.webkit.WebViewAssetLoader;

/**
 * Klipper Öğren — Android kabuğu.
 * Uygulamanın kendisi assets/web klasöründeki HTML/JS'tir. Dosyalar
 * https://appassets.androidplatform.net/ adresinden sunulur; böylece
 * localStorage (ilerleme) ve GitHub'dan haber çekme normal web sitesi gibi çalışır.
 */
public class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final int BG = Color.parseColor("#11151d");
    private WebView web;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(BG);
        getWindow().setNavigationBarColor(BG);

        web = new WebView(this);
        web.setBackgroundColor(BG);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .setDomain(HOST)
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                if (HOST.equals(u.getHost())) return false;
                openExternal(u.toString());
                return true;
            }
        });

        web.addJavascriptInterface(new Bridge(), "AndroidBridge");

        if (savedInstanceState != null) {
            web.restoreState(savedInstanceState);
        } else {
            web.loadUrl("https://" + HOST + "/assets/web/index.html");
        }
    }

    private void openExternal(String url) {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
        } catch (Exception ignored) {
        }
    }

    /** JavaScript'ten çağrılır: window.AndroidBridge.open(url) / haptic(style) */
    private class Bridge {
        @JavascriptInterface
        public void open(final String url) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() { openExternal(url); }
            });
        }

        @JavascriptInterface
        public void haptic(final String style) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    int c = "error".equals(style) ? HapticFeedbackConstants.LONG_PRESS : HapticFeedbackConstants.VIRTUAL_KEY;
                    web.performHapticFeedback(c);
                }
            });
        }
    }

    private void superBack() {
        super.onBackPressed();
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        web.evaluateJavascript(
                "(window.__klipperApp && window.__klipperApp.back) ? window.__klipperApp.back() : false",
                value -> {
                    if (!"true".equals(value)) superBack();
                });
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        web.saveState(outState);
    }
}
