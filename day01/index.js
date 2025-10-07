// 每天给邮箱推送一个笑话或者格言
const fetch = require("node-fetch")
const cheerio = require('cheerio')
const nodemailer = require("nodemailer");
const config = require("./config")
const cron  = require("node-cron")

const DEFAULT_JOKES = [
  "为什么程序员总是分不清万圣节和圣诞节？因为 Oct 31 == Dec 25",
  "我为什么要去学编程？因为我想让电脑帮我工作，这样我就可以安心地...看电脑了",
  "程序员最讨厌的楼梯是啥？Git（梯）"
]
async function getJoke() {
  try {
    const res = await fetch("https://qiushidabaike.com/text")
    const html = await res.text()
    const $ = cheerio.load(html)
    const jokes = []

    $(".content").each((i, e) => {
      const jokeText = $(e).text().trim().replace(/\s+/g, " ")
      if (jokeText.length > 10 && jokeText.length < 500) {
        jokes.push(jokeText)
      }
    })
    if (jokes.length) {
      return jokes[Math.floor(Math.random() * jokes.length)]
    }
    return DEFAULT_JOKES[Math.floor(Math.random() * DEFAULT_JOKES.length)]
  } catch (e) {
    console.error("request error: ", e)
    return DEFAULT_JOKES[Math.floor(Math.random() * DEFAULT_JOKES.length)]
  }
}

async function getMaxim() {
  try {
    const res = await fetch("http://mingyan.hanyupinyin.cn/mingren193.html")
    const html = await res.text()
    const $ = cheerio.load(html)
    const maxims = []

    $(".content").each((i, e) => {
      $(e).find("p").each((i, e) => {
        const maximText = $(e).text().trim().replace(/\s+/g, " ").replace(/^(.)+、/g, "")
        if (maximText.length > 0) {
          maxims.push(maximText)
        }
      })
    })

    return maxims.length > 0 ? maxims[Math.floor(Math.random() * maxims.length)] : null
  } catch (e) {
    console.error("request error: ", e)
    return null
  }
}

async function getSendInfo() {
  let sendText = await getJoke()
  let isMaxim = Math.random() > 0.5
  if (isMaxim) sendText = await getMaxim()
  return {
    subject: isMaxim ? '每日格言' : '每日笑话',
    text: sendText,
  }
}

async function sendEmail() {
  const sendInfo = await getSendInfo()
  const transporter = nodemailer.createTransport({
    service: '163', // 也可以是 'gmail', '163', 'outlook' 等
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS
    },
  });

  const mailOptions = {
    from: config.EMAIL_USER,
    to: config.TO_EMAIL,
    ...sendInfo
  };
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("发送成功")
    return {
      success: true,
      messageId: info.messageId,
      content: info.content,
      source: info.source
    };
  } catch (e) {
    console.error("发送邮件失败：", e)
    return {
      success: false,
      error: e.message
    }
  }

}

cron.schedule("0 9 * * *", () => {
  sendEmail()
}, {
  timezone: "Asia/Shanghai"
})

