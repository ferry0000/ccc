# Java・JavaScript・TypeScriptの配色比較

このフォルダは、既存のダークテーマを使いながら構文色を共通化するためのサンプルと設定案です。ユーザーの `settings.json` は変更していません。設定ファイルを置いただけではVS Codeに適用されません。

- `Sample.java`：interface、enum、ジェネリクス、ラムダ、`@Demo` / `@Override` を含むJavaサンプル。
- `sample.js`：クラス、privateフィールド、アロー関数、JSDoc型注釈を含むJavaScriptサンプル。
- `sample.ts`：interface、enum、ジェネリクス、標準デコレーターを含むTypeScriptサンプル。
- `highlight-config.jsonc`：ユーザー設定にマージする3項目。テーマ名やUI色の設定は含みません。

## 構文要素と色

添付されたEclipseの5枚のスクリーンショットから、文字のRGB値を抽出して設定案を修正しました。たとえば `System` の青、`Closeable` の水色、`ChronoUnit` の桃色、`println` の黄緑、`currentTimeMillis` の太字の緑、`MAX_SKIP_BUFFER_SIZE` の太字の水色を参照しています。背景は画像では `#2F2F2F` ですが、この設定案は背景・UI・テーマを変更しません。

セマンティックトークンを優先し、TextMateを補完に使います。以下は**意図する配色**です。各位置に実際にどのトークンが付くかは言語サービス・拡張機能・バージョンによります。

| 構文要素 | 色・装飾 | 主なセマンティック分類 |
| --- | --- | --- |
| クラス・一般の型名 | 青 `#1290C3` | `type`, `class`, `struct` |
| インターフェース | 明るい水色 `#80F2F6` | `interface` |
| 列挙型 | 桃色 `#CC81BA` | `enum` |
| 型パラメータ・Javaの型引数 | 紫 `#B166DA` | `typeParameter`, Javaの `*.typeArgument:java` |
| 関数・メソッド・コンストラクタの宣言 | 緑 `#1EB540`、通常の太さ | `function.declaration`, `method.declaration`, Javaの `*.constructor.declaration:java` |
| 通常の関数・メソッド・コンストラクタの参照/呼び出し | 黄緑 `#A7EC21` | `function`, `method`, Javaの `*.constructor:java` |
| staticメソッドの参照/呼び出し | 緑 `#96EC3F`、太字 | `method.static`, `function.static` |
| ローカル変数・定数の宣言 | 黄 `#F2F200` | `variable.declaration` |
| ローカル変数・定数の参照 | 淡黄 `#F3EC79` | `variable` |
| 引数（仮引数） | 青 `#79ABFF` | `parameter` |
| インスタンスフィールド・プロパティ | 水色 `#66E1F8` | `property` |
| staticフィールド・列挙メンバー | 水色 `#8DDAF8`、太字 | `property.static`, `variable.static`, `enumMember` |
| キーワード・修飾子・プリミティブ型・真偽値・null | 橙 `#CC6C1D` | `keyword` とTextMateによる補完 |
| 文字列 | 青緑 `#17C6A3` | `string` |
| 数値 | 青灰 `#6897BB` | `number` |
| 比較・算術・論理の記号演算子、ラムダ/アローの矢印 | 白 `#F9FAF4` | `operator` とTextMateによる補完 |
| 括弧・区切り記号 | 淡いラベンダー `#E6E6FA` | TextMateの `punctuation` |
| コメント | 灰 `#808080` | `comment` |
| アノテーション・デコレーター | 灰 `#A0A0A0` | `decorator`, Javaの `annotation:java` |
| JSDoc/Javadocタグ | 灰褐色 `#9A8C7C`、太字 | `keyword.documentation` とTextMateによる補完 |

コメントは添付のスクリーンショットBに合わせ、Javadoc/JSDoc内の引数名・型名・メソッドへの参照も通常の太さの灰色 `#808080` に指定しています。`@param` / `@see` / `@throws` / `@since` などのタグだけを灰褐色 `#9A8C7C` の太字にします。本文中の参照がコードの青・黄緑に変わる表示は抑えます。

反映済みのユーザー設定には、`editor.semanticTokenColorCustomizations.rules`の末尾に追加した `*.documentation` と分類別の `.documentation` ルール群をマージし、`textMateRules`末尾の `Documentation content stays comment gray` と `Documentation tags keep muted bold color` も追加してください。セマンティックトークンが提供されるJavadoc参照はTextMateだけでは補正できないため、両方を追加する必要があります。

宣言と参照、staticとインスタンスの違いを画像に合わせています。staticメソッドでも**宣言位置は通常の太さの緑**です。`public` / `private` / `static` / `final` / `const` / `new` / `if` / `return` は橙色です。Java拡張の `modifier` は `keyword` のサブタイプなので共通ルールを継承します。

`for` / `if` / `new` / `continue` / `return` / `while` / `else` も、`public` / `static` / `final` / `null` と同じ **`#CC6C1D`** に指定しています。`Keyword overrides` で、言語のルートスコープ付きの制御キーワード・修飾子・リテラルを明示しています。

`this` / `super` / `instanceof` も **`#CC6C1D`** です。`this` / `super` はTextMateでは `variable.language`、`instanceof` は `keyword.operator` 系になるため、`Keyword overrides` で各言語の具体的なスコープを補正しています。JS/TSの型としての `this` など、`support.type.builtin` に分類される組み込みの型キーワードも橙色にします。ユーザー設定へ反映済みなら、このルールを `textMateRules` に追加し、既存の `Documentation content stays comment gray` も今回の内容に更新してください。コメントの灰色を保つための追加スコープが含まれています。

**`int` / `boolean` / `void` / `byte` / `char` / `short` / `long` / `float` / `double` は、`Keyword overrides` で `#CC6C1D` に指定しています。** Javaの完全なスコープ `storage.type.primitive.java` と配列型のスコープ、メソッドの戻り値の文脈、JS/TSの `support.type.primitive.js` / `support.type.primitive.ts` を明示し、一般の型名を青にするルールから分離しました。TSの `number` / `string` / `boolean` / `void` などもこのルールの対象です。前の案を反映済みの場合は、`Keyword overrides`をユーザー設定の`textMateRules`に反映してください。クラス名やラッパー型の `Integer` / `Boolean` / `String` は青のままです。

なお、今回の文法テストでは元の設定案もプリミティブ型を橙色にしていました。実環境で表示色が違う原因は未特定です。専用ルールを反映しても異なる場合はInspectorで適用ルールとセマンティック分類を確認してください。TextMateではセマンティックトークンの色を上書きできないため、さらに広い型ルールを橙色にする変更は行っていません。

前の案の「readonlyは金色」という区別は変更しました。`final` / `const` のローカル変数も黄系、`readonly` のインスタンスプロパティも水色です。staticフィールドは読み取り専用かどうかにかかわらず太字の水色です。参照先のオブジェクトの不変性を示す配色ではありません。

### グローバル定数の分類上の制約

添付されたVS CodeのInspector画像では、Javaの`MIN_PRICE`は`property`に`static readonly declaration public`、JSは`variable`に`declaration readonly local`、TSは`variable`に`declaration readonly`が付いています。Javaの表示色は**`#8DDAF8`、太字**です。JS/TSの`variable.readonly`を水色にする方法では、関数内の`const`まで同色になるため、その変更は取り消しました。

ユーザー設定に直前の変更を反映済みの場合は、`editor.semanticTokenColorCustomizations.rules`から、今回追加した次の4キーだけを削除してください：`variable.readonly:javascript`、`variable.readonly.declaration:javascript`、`variable.readonly:typescript`、`variable.readonly.declaration:typescript`。ほかの設定はそのまま残します。

標準のセマンティック配色設定には、JS/TSのグローバル・モジュール定数と関数内の`const`を両言語で確実に区別できる共通セレクターがありません。識別子名や大文字表記も指定できません。宣言位置だけをTextMateの文脈で色分けしても、参照位置まで同じ分類にすることはできません。この設定案ではJS/TSの`const`は黄系に戻し、Javaのstaticフィールドの水色は維持します。

型引数の紫は画像の `Boolean` / `ProtectionDomain` の表示を参考にしています。型パラメータ `T` 自体の色は画像では確認できないため、同じ紫を採用しました。JS/TSにはJava拡張の `typeArgument` 修飾子に相当する標準分類がないため、`Processor<Item>` の `Item` まで紫に統一できるとは限りません。

装飾も画像に寄せ、セマンティックトークンの太字・斜体をいったん無効にして、staticメソッド・staticフィールド・列挙メンバー・ドキュメントタグの太字を指定しています。TextMateの対象スコープにも `fontStyle` を指定します。未指定の構文色やUIはテーマの配色を使います。共通ルールは全言語・全テーマに適用されるので、ほかの言語にも影響し、ライトテーマには適さない場合があります。括弧ペアの色分け機能が有効な場合、括弧の表示色はその設定にも左右されます。

## 設定案の整理

追加修正で長くなっていたJSONCを、配色・装飾・スコープ順序を保って289行から152行へ整理しました。TextMateルールは26件から23件へ統合しています。同じ色・装飾の**隣接ルールだけ**をまとめ、セマンティックルール64件のキー・値・順序は変更していません。`Keyword overrides`は、従来の制御キーワード・プリミティブ型・this/super/instanceof用の3ルールを統合したものです。

分類や修飾子の異なるセマンティックセレクターは、単純に同じ色だからという理由では削除していません。具体的なルールの優先順位が、static・readonly・documentationの配色に影響するためです。最小行数よりも、既存の表示を保つことを優先しています。

ユーザーの`settings.json`には触れていません。反映済みの設定を整理する場合は、今回の案に由来する`textMateRules`のルール群を整理後の23件で置き換え、ほかの既存ルール・設定は残してください。セマンティック設定は同一なので変更不要です。

## ユーザーsettings.jsonへの反映

1. コマンドパレット（Windowsでは `Ctrl+Shift+P`）から **Preferences: Open User Settings (JSON)** を実行します。現在のプロファイルのユーザー設定を開き、編集前にバックアップします。
2. `highlight-config.jsonc` の外側の `{ ... }` の中にある3項目を、既存の設定オブジェクトへマージします。ファイル全体で既存設定を置き換えないでください。
3. 同名キーがなければ項目を追加します。既にあれば同じキーを二重に追加せず、下記の方法で中身を統合します。

| 既存の設定キー | マージ方法 |
| --- | --- |
| `editor.semanticHighlighting.enabled` | この項目の値を `true` に変更します。 |
| `editor.semanticTokenColorCustomizations` | 既存の `rules` に今回のセレクターを追加します。同一セレクターがあれば今回の色へ更新し、オブジェクト形式なら `foreground` を更新し、今回明示する `bold` / `italic` も反映します。それ以外の既存属性は残します。ほかのセレクターやテーマ別設定は残します。 |
| `editor.tokenColorCustomizations` | 既存の `textMateRules` 配列の末尾に今回のルールを追加します。前の案を適用済みなら、その案のルール群だけを今回のルール群で更新します。ほかの既存ルールや `comments` などの項目、テーマ別設定は残します。 |

既存のより具体的なセマンティックルール（例：`variable.readonly:typescript`）やTextMateスコープ、現在のテーマ名を指定したブロックが競合すると、この案と違う色になることがあります。既存設定を消すのではなく、Inspectorで実際に適用されたルールを確認して、競合する項目だけ調整します。TextMateは末尾に足せば必ず勝つわけではなく、スコープの具体性も影響します。

保存後、設定エディターの診断で構文エラーや重複キーがないことを確認してください。ユーザー設定はJSONCなのでコメントを含められます。設定が反映されない場合は、ワークスペース設定、言語別の設定、リモート設定、使用中のプロファイルによる上書きも確認します。

## VS Codeで配色を確認する手順

1. このフォルダをVS Codeで開きます。既存のダークテーマを使います。比較しやすい例は組み込みの **Dark+** / **Dark Modern** です。今回の案はテーマ選択を自動で変更しません。
2. JavaScript / TypeScriptの組み込み言語機能を有効にします。Javaでは **Language Support for Java by Red Hat** と対応JDKが必要です。Javaのセマンティック解析が完了するまで待ちます。簡易モード等で提供が不十分なら標準モードの言語サービスで確認します。
3. `Sample.java`, `sample.js`, `sample.ts` を横に並べ、右下の言語モードがそれぞれJava / JavaScript / TypeScriptであることを確認します。
4. 設定をマージした後、`Item`, `Named`, `Status`, `Processor`, `T`, `collect`, `identity`, `count`, `index`, `MIN_PRICE`, `predicate` を、宣言位置と使用位置の両方で比較します。加えて修飾子、制御構文、リテラル、演算子、矢印、コメント、`@Demo` / `@demo` を確認します。
5. 言語サービス起動中はTextMate色からセマンティック色へ変わる場合があります。解析完了後に比較し、必要なら **Developer: Reload Window** を実行します。

各サンプルは同じ3商品から、ACTIVEかつ価格100以上の商品を選び、名前と金額を出力します。想定結果は共通で次のとおりです。

```text
item:apple total=180 missing=false
```

JavaはJDK 11以降の `java Sample.java`、JavaScriptはprivateフィールド対応Node.jsで `node sample.js` と実行できます。TypeScriptは5.0以降の標準デコレーターを使います。`tsc --strict --target ES2022 --module commonjs --outDir <出力先> sample.ts` でコンパイルし、出力先の `sample.js` をNode.jsで実行できます。比較用の元の `sample.js` を上書きしないよう、必ず別の出力先を指定してください。標準デコレーターのサンプルなので `experimentalDecorators` は有効にしません。

## Developer: Inspect Editor Tokens and Scopes

1. 確認する識別子やキーワードの文字上にカーソルを置きます。
2. コマンドパレットから **Developer: Inspect Editor Tokens and Scopes** を実行します。
3. 表示された **semantic token type**、**modifiers**、**textmate scopes**、**foreground** と、色を決定したルールを記録します。セマンティック情報がある場合は、それがTextMateの上に適用されます。
4. 同じ意味の要素について、3ファイルの結果を比較します。宣言と参照の分類が違う場合もあるため、両方を調べます。ポップアップは `Escape` で閉じます。

セマンティック欄がない場合、その位置にはセマンティックトークンがない、機能が無効、または言語サービスが未起動などの可能性があります。単に「TextMateルールが足りない」と判断せず、設定と拡張の状態から確認します。

## 分類が異なる場合の対応

- まず共通分類を同じ色にまとめます。この案では `function` / `method` をそろえ、クラス・インターフェース・列挙型、ローカル変数・プロパティは画像に従って別の色にしています。言語が違っても同じ意味・同じ修飾子には同じルールを使います。
- セマンティック情報がない位置だけTextMateで補います。広い `meta.*` 全体を塗ると式や引数まで同色になるため、Inspectorで得た具体的なスコープを使います。
- 拡張独自の分類が必要な場合だけ `tokenType.modifier:languageId` を追加します。この案のセマンティックな言語別補正は、ローカルのRed Hat Java拡張1.56.0の定義に基づく `annotation:java`、`*.constructor:java` / `*.constructor.declaration:java`、`*.typeArgument:java` です。JS/TSの `constructor` は宣言位置のTextMate文脈で補います。
- 例としてJavaのフィールドが独自の `field` と表示された環境なら、**実測してから** `"field:java": "#66E1F8"`、staticなら `"field.static:java": { "foreground": "#8DDAF8", "bold": true }` を `rules` に追加します。今回の案では未確認の分類を先回りして追加していません。
- `new Item(...)` の `Item` はコンストラクタ呼び出しでも型名として分類される場合があります。その場合は型色になります。設定は既存の分類に色を付ける機能であり、新しい分類を作る機能ではありません。
- JavaScriptにはネイティブのinterface、enum、型パラメータ、Java形式のアノテーションがありません。JSDocの `@typedef`, `@enum`, `@template`, `@implements` と `Object.freeze` で対応する意図を表現していますが、Java/TSと同じ分類になる保証はありません。`Object.freeze` のメンバーも必ず `enumMember` / `readonly` になるわけではありません。
- Java/TSの `Item` フィールドは `final` / `readonly` ですが、JSのフィールドは代入可能です。ここは実際の意味に差があります。今回はreadonlyによる色分けを行わず、どちらもインスタンスプロパティの水色にそろえています。
- TSのデコレーター参照が `decorator` でなく `function` と分類される環境では関数色が優先されます。TextMateで強制的にセマンティック色を上書きすることはできません。すべての関数をアノテーション色にする補正は避け、必要なら言語サービス側の分類改善を検討します。JSDocのタグと型名も別分類です。

## 検証範囲

今回の整理では、セマンティック設定が整理前後で完全に同一であること、TextMateの全スコープと色・装飾の組が同じ順序で残ることを比較しました。さらにVS Code同梱のTextMateエンジンで3言語のサンプルと追加のコメント・キーワード例を比較し、すべての文字の色・フォント装飾が一致することを確認しました。実際のエディター表示は未検証です。

`this` / `super` / `instanceof` の追加修正では、VS Code同梱のTextMateエンジンとJava・JavaScript・TypeScriptの文法で、3言語とも3語が `#CC6C1D` になること、行コメントが灰色のままであることを確認しました。実際のエディター表示は未検証です。

コメントの追加修正では、VS Code同梱のTextMateエンジンとJava文法で、Javadocの`@param`引数名・`@throws`例外型・`@link`参照が灰色、タグが灰褐色になることを確認しました。セマンティックな参照向けの`.documentation`ルールも追加しましたが、反映後の実エディター表示は未検証です。

今回の修正では添付画像の画素色を抽出し、配色表と設定値を対応させ、JSONCの構文とルールの基本構造を確認しました。画像はEclipseの表示であり、Eclipseの元の設定ファイルは確認していません。

プリミティブ型の追加修正では、VS Code同梱のTextMateエンジンとJava拡張・組み込みJava・TypeScriptの文法を使い、`int` / `boolean` / `void`（TSでは `number` も）のトークンが `#CC6C1D` になることを確認しました。これは設定案単体の文法テストであり、ユーザーの実際のエディター表示の検証ではありません。

VS Code公式の設定仕様と、ローカルにある言語文法・Java拡張のトークン定義を参照して作成しました。JSONCの構文・配色ルールの基本構造、Java/JSの実行、TypeScriptの厳密型チェックと変換後の実行、JSDoc付きJSの厳密型チェックを確認しています。3言語の出力は一致します。

**実際のVS Codeエディター表示とInspectorの各トークンは未検証です。** 設定のユーザー環境への反映、色の完全一致、既存テーマとの競合がないことは検証済みとはしていません。

公式資料：

- [Themes：構文色のカスタマイズとInspector](https://code.visualstudio.com/docs/configure/themes)
- [Semantic Highlight Guide：標準分類・修飾子・セレクター](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide)
- [Syntax Highlight Guide：TextMateスコープと優先順位](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide)
