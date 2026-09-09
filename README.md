# IELTS 語彙（オフライン版）

AWL 570語族 ＋ GSL 上位1000＝**1,615語**の語彙ドリル。
ネットが無くても回せるように、**1枚の HTML にフォントごと全部入れて** Service Worker でキャッシュしている。

→ https://spicysnow-sub.github.io/ielts-vocab/

iPad / iPhone は Safari で開いて〈共有〉→〈ホーム画面に追加〉。以後は機内でもアイコンから開ける。

## 中身

- **3形式**：英→日／日→英の4択、綴り入力
- **範囲**：全部／AWLのみ／sublist 1-5／6-10／GSLのみ／つまずいた語だけ
- 語ごとの状態は `[出題回数, 連続正解, 誤答回数]` の3つ組。**正解2連続で重みが 4→0.6** に落ちる
  ＝知っている語が早く抜け、残りの出題が知らない語に回る
- 記録は**この端末の中だけ**（localStorage）。どこにも送らない。
  IELTS ドリル本体との受け渡しは、画面下の〈コードで受け渡し〉で行う（合流は「出題回数が多い方を残す」）

## このリポジトリは生成物

**ここを直さない。**正本は MinariVault 側にあり、ビルドで丸ごと置き換わる。

```
MinariVault/40_Life/学び・趣味/語学/English/drills/_src/
  vocab_engine.html      中身（設問・採点・重み・受け渡し）＝ドリル本体と共有
  vocab_words.js         単語データ
  offline/shell.html     オフライン版だけのガワ
  offline/fonts_inline.css  埋め込みフォント（latin サブセット）
  build_offline.py       → このリポジトリを出力
```

ビルド：

```
cd _src && python3 build_offline.py ~/ielts-vocab
```
