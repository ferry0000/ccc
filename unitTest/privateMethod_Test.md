結論から言うと、**Mockitoでは private メソッドを直接テスト・モック・verify する機能は基本的にありません**。Mockito公式FAQでも「private methods はテストの観点では存在しない」として、private メソッドのモックはできないと説明されています。([GitHub][1])

一方、**JMockitは古いバージョンでは private メソッドにアクセス・モックできる機能がありましたが、現在は注意が必要**です。JMockit 1.36で `Deencapsulation.invoke` が削除され、1.47で `Deencapsulation` 自体が削除され、private メソッドやコンストラクタを対象にした `@Mock` は例外になるよう変更されています。([jmockit.github.io][2])

## 1. Mockitoの場合

Mockitoでできるのは、基本的に **public / protected / package-private メソッドや依存オブジェクトのモック**です。

例えば、これはできません。

```java
class Sample {
    public int execute(int x) {
        return privateCalc(x);
    }

    private int privateCalc(int x) {
        return x * 2;
    }
}
```

Mockitoで次のように private メソッドを指定することはできません。

```java
when(sample.privateCalc(10)).thenReturn(999); // コンパイル不可
verify(sample).privateCalc(10);              // コンパイル不可
```

`privateCalc` はクラス外から見えないので、Mockito以前にJavaのアクセス制御で呼び出せません。

## 2. privateメソッドは通常どうテストするか

基本は、**privateメソッドを直接テストせず、その private メソッドを使っている public メソッドをテストします**。

```java
class Sample {
    public int execute(int x) {
        return privateCalc(x);
    }

    private int privateCalc(int x) {
        return x * 2;
    }
}
```

テストはこう書きます。

```java
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class SampleTest {

    @Test
    void executeは値を2倍にする() {
        Sample sample = new Sample();

        int actual = sample.execute(10);

        assertEquals(20, actual);
    }
}
```

この場合、`privateCalc` 自体を直接呼んではいませんが、`execute()` の結果を通して `privateCalc` の動作も検証しています。

## 3. privateメソッドを直接テストしたい場合

技術的には、**MockitoではなくJavaのリフレクション**を使えば呼べます。

```java
import static org.junit.jupiter.api.Assertions.*;
import java.lang.reflect.Method;
import org.junit.jupiter.api.Test;

class SampleTest {

    @Test
    void privateCalcを直接呼ぶ() throws Exception {
        Sample sample = new Sample();

        Method method = Sample.class.getDeclaredMethod("privateCalc", int.class);
        method.setAccessible(true);

        int actual = (int) method.invoke(sample, 10);

        assertEquals(20, actual);
    }
}
```

ただし、これはあまり推奨されません。理由は、private メソッド名や引数を少し変えただけでテストが壊れやすく、実装詳細に強く依存するからです。

## 4. privateメソッドをモックしたくなる場合の設計

privateメソッドをモックしたい場合、多くは次のような状態です。

```java
class OrderService {
    public int calculatePrice(int price) {
        int tax = calculateTax(price); // ここだけ差し替えたい
        return price + tax;
    }

    private int calculateTax(int price) {
        // 複雑な処理
        return price / 10;
    }
}
```

この場合、`calculateTax` を private メソッドのままモックするのではなく、**別クラスに切り出して依存オブジェクトとして注入する**方が自然です。

```java
class TaxCalculator {
    int calculateTax(int price) {
        return price / 10;
    }
}

class OrderService {
    private final TaxCalculator taxCalculator;

    OrderService(TaxCalculator taxCalculator) {
        this.taxCalculator = taxCalculator;
    }

    public int calculatePrice(int price) {
        return price + taxCalculator.calculateTax(price);
    }
}
```

Mockitoテストはこう書けます。

```java
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.junit.jupiter.api.Test;

class OrderServiceTest {

    @Test
    void 税計算結果を使って価格を計算する() {
        TaxCalculator taxCalculator = mock(TaxCalculator.class);
        when(taxCalculator.calculateTax(1000)).thenReturn(100);

        OrderService service = new OrderService(taxCalculator);

        int actual = service.calculatePrice(1000);

        assertEquals(1100, actual);
        verify(taxCalculator).calculateTax(1000);
    }
}
```

この形にすると、private メソッドを無理にモックしなくても、単体テストしやすくなります。

## 5. JMockitならできるか

古いJMockitでは、privateメソッドを直接呼ぶ・差し替えるような書き方が可能だった時期があります。しかし、現在のJMockitの変更履歴では `Deencapsulation` が削除され、private メソッド・コンストラクタを対象にした `@Mock` も例外になる方向へ変更されています。([jmockit.github.io][2])

そのため、今から新しく書くなら、**JMockitでprivateメソッドをテストする前提にはしない方がよい**です。

## まとめ

| やりたいこと                  | Mockito |                 JMockit |
| ----------------------- | ------: | ----------------------: |
| privateメソッドを直接呼ぶ        |      不可 | 古い版では可能だったが現行では非推奨・削除傾向 |
| privateメソッドをモックする       |      不可 |  古い版では可能だったが現行では非推奨・例外化 |
| publicメソッド経由で結果を検証      |      可能 |                      可能 |
| private処理を別クラスに切り出してモック |      可能 |                      可能 |

実務上は、**privateメソッドは直接テストしない**、または **複雑すぎる private メソッドは別クラスに切り出して public/package-private な責務としてテストする**のが基本です。

[1]: https://github.com/mockito/mockito/wiki/FAQ?utm_source=chatgpt.com "FAQ · mockito/mockito Wiki"
[2]: https://jmockit.github.io/changes.html "JMockit - Development history"



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

できます。**古いJMockitでは `mockit.Deencapsulation.invoke(...)` を使って private メソッドを直接呼び出せました。**

ただし、対象は **JMockit 1.35以前** です。JMockit 1.35で `Deencapsulation.invoke` は deprecated になり、1.36で削除されています。さらに1.47では `Deencapsulation` クラス自体が削除されています。([jmockit.github.io][1])

## 例：privateメソッドを直接呼ぶ

対象クラスが次のようなものだとします。

```java
public class SampleService {

    public int execute(int value) {
        return calc(value);
    }

    private int calc(int value) {
        return value * 2;
    }
}
```

JMockit 1.35以前なら、テスト側で次のように呼べます。

```java
import mockit.Deencapsulation;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class SampleServiceTest {

    @Test
    public void privateメソッドを直接呼ぶ() {
        SampleService service = new SampleService();

        int actual = Deencapsulation.invoke(service, "calc", 10);

        assertEquals(20, actual);
    }
}
```

ポイントはここです。

```java
int actual = Deencapsulation.invoke(service, "calc", 10);
```

意味は、

```java
対象インスタンス, "privateメソッド名", 引数
```

です。

## static privateメソッドの場合

対象クラスがこうだとします。

```java
public class SampleUtil {

    private static String addPrefix(String value) {
        return "prefix_" + value;
    }
}
```

テストはこう書けます。

```java
import mockit.Deencapsulation;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class SampleUtilTest {

    @Test
    public void staticなprivateメソッドを直接呼ぶ() {
        String actual = Deencapsulation.invoke(
            SampleUtil.class,
            "addPrefix",
            "abc"
        );

        assertEquals("prefix_abc", actual);
    }
}
```

## 戻り値がvoidの場合

```java
public class Counter {

    private int count;

    private void increment() {
        count++;
    }

    public int getCount() {
        return count;
    }
}
```

テストはこうです。

```java
import mockit.Deencapsulation;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class CounterTest {

    @Test
    public void voidのprivateメソッドを呼ぶ() {
        Counter counter = new Counter();

        Deencapsulation.invoke(counter, "increment");

        assertEquals(1, counter.getCount());
    }
}
```

## Mavenの例

古い `Deencapsulation.invoke` を使うなら、例えば JMockit 1.34 以前を指定します。

```xml
<dependency>
    <groupId>org.jmockit</groupId>
    <artifactId>jmockit</artifactId>
    <version>1.34</version>
    <scope>test</scope>
</dependency>
```

`1.35` でも `invoke` は残っていますが deprecated です。`1.36` 以降では `Deencapsulation.invoke` が削除されているため、同じコードはコンパイルできません。([jmockit.github.io][1])

## 注意点

この方法は、privateメソッド名を文字列で指定します。

```java
Deencapsulation.invoke(service, "calc", 10);
```

そのため、`calc` を `calculate` にリネームしてもIDEのリファクタリングが追従しない場合があります。結果として、テストが実装詳細に強く依存します。

実務上は、どうしても既存コードを変更できない場合の暫定手段として使い、基本は次のどちらかにする方が安全です。

```java
// 1. publicメソッド経由でprivateメソッドの結果を検証する
service.execute(10);

// 2. privateメソッドが複雑なら、別クラスへ切り出してテストする
TaxCalculator.calculate(...);
```

要するに、古いJMockitでは次の形です。

```java
戻り値の型 result = Deencapsulation.invoke(対象オブジェクト, "privateメソッド名", 引数...);
```

static privateメソッドなら次の形です。

```java
戻り値の型 result = Deencapsulation.invoke(対象クラス.class, "privateメソッド名", 引数...);
```

[1]: https://jmockit.github.io/changes.html "JMockit - Development history"


