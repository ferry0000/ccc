`git revert` と `git restore` は、どちらも「変更を取り消す」系のコマンドですが、対象が違います。

## 大きな違い

| コマンド          | 何を取り消すか        | コミット履歴への影響     | 主な用途                     |
| ------------- | -------------- | -------------- | ------------------------ |
| `git revert`  | **過去のコミット**    | 新しい取り消しコミットを作る | すでにコミット・プッシュした変更を安全に打ち消す |
| `git restore` | **作業中のファイル変更** | コミット履歴は変えない    | まだコミットしていない変更を元に戻す       |

---

# git revert とは

`git revert` は、指定したコミットの変更を**打ち消す新しいコミット**を作ります。

例：

```bash
git revert abc1234
```

これは、

> `abc1234` というコミットで加えた変更を取り消すコミットを新しく作る

という意味です。

履歴はこうなります。

```text
A -- B -- C -- D
          ↑
       取り消したい
```

`git revert C` をすると、

```text
A -- B -- C -- D -- E
                  ↑
              Cを打ち消すコミット
```

となります。

`C` 自体は履歴から消えません。
その代わり、`C` の内容を逆向きに適用したコミット `E` が追加されます。

## revert を使う場面

特に重要なのは、**すでに push したコミットを取り消す場合**です。

```bash
git revert <コミットID>
git push
```

これなら、リモートの履歴を壊さずに取り消せます。

チーム開発では、誤って push した変更を取り消すときは、基本的に `revert` が安全です。

---

# git restore とは

`git restore` は、作業ツリーやステージングエリアのファイルを元に戻すコマンドです。

つまり、主に

```text
まだコミットしていない変更
```

を取り消すために使います。

例：

```bash
git restore Sample.java
```

これは、`Sample.java` の作業中の変更を最後のコミット時点に戻します。

---

## 例：ファイルを編集したが、やっぱり戻したい

```bash
git status
```

で次のように出ているとします。

```text
modified: Sample.java
```

まだ `git add` していないなら、

```bash
git restore Sample.java
```

で変更を破棄できます。

---

## git add した変更をステージから外す

```bash
git add Sample.java
```

した後に、ステージングを取り消したい場合は、

```bash
git restore --staged Sample.java
```

です。

これは「ファイルの内容を元に戻す」のではなく、**add した状態を解除する**だけです。

その後、作業中の変更自体も消したいなら、

```bash
git restore Sample.java
```

も実行します。

---

# 使い分け

## まだコミットしていない変更を取り消したい

```bash
git restore ファイル名
```

例：

```bash
git restore src/Main.java
```

## git add だけ取り消したい

```bash
git restore --staged ファイル名
```

## すでにコミットした変更を打ち消したい

```bash
git revert コミットID
```

## すでに push したコミットを取り消したい

```bash
git revert コミットID
git push
```

---

# 注意点

`git restore` は、作業中の変更を**消します**。
消した内容は基本的に戻せないので注意してください。

```bash
git restore ファイル名
```

を実行すると、そのファイルの未コミット変更は破棄されます。

一方で、`git revert` は履歴に新しいコミットを作るので、比較的安全です。

---

# まとめ

```text
revert  = コミットを打ち消す
restore = ファイルの作業中変更を戻す
```

誤って **push したコミット** を取り消したいなら、基本は

```bash
git revert <コミットID>
git push
```

です。

まだ **push どころか commit もしていないファイル変更** を戻したいなら、

```bash
git restore <ファイル名>
```

です。



<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>


はい。あります。
`git revert <コミットID>` は、そのコミットの変更を**丸ごと打ち消す**ので、一部だけ残したい場合は `--no-commit` を使います。

## 方法：revert を一旦コミットせずに止める

```bash
git revert --no-commit <コミットID>
```

または短く、

```bash
git revert -n <コミットID>
```

これで、指定したコミットの取り消し内容が作業ツリーに反映されますが、**まだコミットされません**。

そのあと、残したい変更を戻してからコミットします。

---

# 例：コミットの一部だけ取り消す

まず作業状態をきれいにしておきます。

```bash
git status
```

何も変更がない状態で実行するのが安全です。

```bash
git revert -n abc1234
```

この時点で、`abc1234` の変更を打ち消す内容が作業中の変更として出ます。

確認します。

```bash
git status
git diff
```

---

## ファイル単位で一部を残す場合

たとえば、`A.java` の変更は取り消したいが、`B.java` の変更は残したい場合。

```bash
git revert -n abc1234
```

その後、残したい `B.java` を元に戻します。

```bash
git restore --source=HEAD --staged --worktree B.java
```

そしてコミットします。

```bash
git commit -m "Partially revert abc1234"
git push
```

これで、`A.java` の変更だけが取り消され、`B.java` の変更は残ります。

---

# 同じファイル内で一部だけ残す場合

同じファイルの中で、取り消す部分と残す部分を選びたい場合は、パッチ単位で選びます。

```bash
git revert -n abc1234
```

いったんステージを外します。

```bash
git reset
```

取り消したい部分だけ選んでステージします。

```bash
git add -p
```

その後、選んだ部分だけコミットします。

```bash
git commit -m "Partially revert abc1234"
```

コミットしなかった変更を捨てます。

```bash
git restore .
```

最後に push します。

```bash
git push
```

---

# 流れのイメージ

```bash
git revert -n <コミットID>
git reset
git add -p
git commit -m "Partially revert <コミットID>"
git restore .
git push
```

この方法なら、指定したコミットの中から**取り消したい部分だけ**を選べます。

---

# 注意

`git restore .` は、コミットしなかった変更を破棄します。
実行前に必ず確認してください。

```bash
git diff
git status
```

安全にやるなら、作業前にブランチを作っておくとよいです。

```bash
git switch -c partial-revert
```

まとめると、**一部だけ revert したい場合は `git revert -n` を使って、取り消す内容を手動で調整してから commit/push** します。
