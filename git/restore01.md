VS Code上でも、基本は **Gitコマンドで取り消す** のが確実です。
「すでに push 済み」なら、原則として **履歴を書き換えず、新しい取り消しコミットを作って push** するのが安全です。

## 一番安全な方法：そのファイルだけ前の状態に戻して再pushする

例として、誤って変更したファイルがこれだとします。

```bash
src/main/java/Example.java
```

### 1. VS Codeでターミナルを開く

VS Codeで対象リポジトリを開き、ターミナルを開きます。

```bash
Ctrl + `
```

またはメニューから、

```text
ターミナル > 新しいターミナル
```

---

### 2. 直前のコミットの前の状態に戻す

誤って push した変更が **直前のコミット** に含まれているなら、以下でそのファイルだけ戻せます。

```bash
git restore --source=HEAD~1 -- src/main/java/Example.java
```

これは、

> `Example.java` だけを、1つ前のコミット時点の内容に戻す

という意味です。

---

### 3. 差分を確認する

```bash
git diff
```

VS Codeのソース管理画面でも、戻した内容を確認できます。

---

### 4. 取り消しコミットを作る

```bash
git add src/main/java/Example.java
git commit -m "誤ってpushしたファイル変更を取り消し"
git push
```

これで、リモート上でもそのファイルの変更が取り消されます。

---

## 特定の過去コミットの状態に戻したい場合

「直前」ではなく、もっと前の状態に戻したい場合は、まず履歴を見ます。

```bash
git log --oneline
```

例：

```text
abc1234 誤ってファイルを変更
def5678 正しい状態
ghi9999 さらに前の変更
```

`def5678` の時点のファイルに戻したいなら、

```bash
git restore --source=def5678 -- src/main/java/Example.java
```

その後は同じです。

```bash
git add src/main/java/Example.java
git commit -m "Example.javaを以前の状態に戻す"
git push
```

---

## ファイルを削除したい場合

「変更を戻す」ではなく、誤って push したファイル自体を消したいなら、

```bash
git rm path/to/file
git commit -m "誤ってpushしたファイルを削除"
git push
```

ただし、これだと **Gitの履歴にはファイルが残ります**。

---

## パスワードや秘密鍵をpushした場合

`.env`、秘密鍵、APIキー、パスワードなどを push した場合は、単に削除コミットするだけでは不十分です。履歴に残るためです。

その場合は、

1. まずキーやパスワードを無効化・再発行する
2. Git履歴から削除する
3. force pushする
4. チームに再cloneや履歴同期を依頼する

という対応になります。

履歴削除には例えば以下を使います。

```bash
git filter-repo
```

またはGitHubなら、機密情報の削除手順に従います。

---

## 非推奨だが、push自体をなかったことにする方法

自分だけのブランチで、他の人がまだ使っていないなら、直前のpushを取り消すこともできます。

```bash
git reset --hard HEAD~1
git push --force-with-lease
```

ただしこれは **リモートの履歴を書き換えます**。
共有ブランチ、`main`、`develop` では基本的に避けた方がいいです。

---

## 基本的にはこれを使えばよいです

誤ってpushしたファイル変更を安全に取り消すなら、まずはこれです。

```bash
git restore --source=HEAD~1 -- path/to/file
git add path/to/file
git commit -m "誤ってpushしたファイル変更を取り消し"
git push
```

共有ブランチなら、`reset` や `force push` ではなく、この方法が安全です。
