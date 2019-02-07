# うぇぶコメント

## 概要

うぇぶコメント(https://pc-lens.firebaseapp.com/) のコメントを取得、投稿する機能を実装しています。  
スクロール量と URL をコピペして使用してください。

## インストール方法

### Google Chrome & Chromium 派生

```bash
git clone https://github.com/yga1709/ExtViewPCLens
```

もしくは上記 Clone or Download から ZIP 形式でダウンロード、解凍してください。  
その後、Chrome のアドレスバーに `chrome://extensions` と入力し拡張機能管理画面を出したのち、右上のデベロッパーモードにチェックを入れ当拡張機能をドラッグ＆ドロップでインストールが完了します。

### Firefox

Release から xpi ファイルをダウンロードし、Firefox のアドオン管理でファイルからインストールしてください。  
もしくは、Google Chrome と同じようにディレクトリでダウンロードし、アドオンのデバッグから一時的なアドオンとして読み込んでください。

## 既知の問題

- ajax による画面遷移には対応していませんので、リロードしてください。
- ページ読み込みが完全に完了するまでは URL とスクロール量の読み込みはされません。
- 既存のスタイルシートと競合してコメントが隠れることがあります。

## 動作環境

動作確認済みのブラウザです。

- Google Chrome 71
- Firefox Quantum 65
- Opera 58

## アップデート

- **Ver 1.1.2** Popup.html のレイアウト修正
- **Ver 1.1.1** Firefox 版 バグ修正
- **Ver 1.1.0** Firefox 対応
- **Ver 1.0.0** リリースバージョン

## 今後追加予定の機能

- 名前の記憶機能
- スタンプ機能等

## LICENSE

MIT License
