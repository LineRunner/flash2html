flash2html
============

利用flash来帮助排版的小工具，直接导出成相关html,css,images。  

安装方法:  
  运行install.jsfl（双击打开运行，如果是默认flash打开不运行的，可以点击编辑窗口右上角三角运行按钮运行脚本即可）  
删除方法:  
  运行uninstall.jsfl  

安装后即可在flash软件菜单Commands中找到flash2html命令集  
psd2div.css  
此命令专为psd导入的方式做了优化处理，节约了导入后的整理时间  
bitmap转成带background属性的div标签（以方便webpack打包之用），  
movieclip转成没有高宽的div标签，  
普通文本框转成p标签（包含文本内容），  
输入文本框转成input标签（不包含文本内容，仅供定位之用），  
以上四种标签都会继承flash中原素材的位置旋转缩放信息。  

psd2div.less  
此命令和以上命令作用基本相同,唯一不同是会生成less文件取代css文件,结构更简洁(但不能看到实时效果,需要其他工具帮助支持less格式后才能查看)  





配合athena-with-webpack:https://github.com/shrekshrek/athena-with-webpack  
可以做到非常流畅的开发体验  

