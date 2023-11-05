const express=require("express");
const app=express();

// 设置路由以提供登录表单
app.use(express.urlencoded({ extended: false }));
app.get('/login', (req, res) => {
  res.send(`
    <form method="post" action="/login">
      <input type="text" name="username" placeholder="用户名">
      <input type="password" name="password" placeholder="密码">
      <button type="submit">登录</button>
    </form>
  `);
});

// 处理登录表单的 POST 请求
app.post('/login', (req, res) => {
  const username= req.body.username;
  const password = req.body.password;

  // 在实际应用中，这里通常会与数据库或其他验证方法进行用户身份验证
  // 这里只是一个简单的演示
  if (username === 'user' && password === 'password') {
    res.send('登录成功！');
  } else {
    res.send('登录失败，请检查用户名和密码。');
  }
});

app.listen(3000, () => {
  console.log('服务器已启动在端口 3000');
});