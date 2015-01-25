sSlide
======

使用
---

### 选项

属性       | 默认值 | 说明
--------- | ----- | ---
slideElem | 'li'  | 单个幻灯片
minMove   | 30    | 最小移动距离，超过则翻页
moveSpeed | 300   | 翻页速度
arrow     | true  | 显示控制箭头
direction | 'X'   | 上下/左右滑动

### Demo

HTML

```html
<ul id="slideList">
	<li class="page page1">1</li>
    <li class="page page2">2</li>
    <li class="page page3">3</li>
	<li class="page page4">4</li>
</ul>
```

Javascript
```javascript
$('#slideList').sSlide({
    direction: 'Y'
});
```