import turtle
import random

WIDTH = 800
HEIGHT = 800
BORDER_COLOR = "red"

t = turtle.Turtle()


def drawRect(width, height, color):
  t.color(color)
  t.forward(width)
  t.right(90)
  t.forward(height)
  t.right(90)
  t.forward(width)
  t.right(90)
  t.forward(height)

def drawLine(lineLength, angle):
  t.right(angle)
  t.forward(lineLength)


def setPosition(x, y):
  t.penup()
  t.goto(x, y)
  t.pendown()

def drawBranch():
  angle = random.randint(0, 80)
  lineLength = random.randint(5, 100)
  drawLine(lineLength, angle)

def drawStar(length):
  t.begin_fill()
  for i in range(5):
    t.forward(length)
    t.right(144)
  t.end_fill()

# 画边框
setPosition(-WIDTH/2, HEIGHT/2)
t.color('red')
t.begin_fill()
drawRect(WIDTH, HEIGHT, BORDER_COLOR)
t.end_fill()
# 底部中间为起始点
# setPosition(0, -HEIGHT/2)
# t.left(90)

# 重置起点
setPosition(-100, 0)
t.right(90)
t.color('yellow')
drawStar(200)

# 隐藏海龟
t.hideturtle()
turtle.done()

