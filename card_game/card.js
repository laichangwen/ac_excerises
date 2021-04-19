const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished",
}
const total_cards = 52

const Symbols = [
  'https://image.flaticon.com/icons/svg/105/105223.svg', // 黑桃
  'https://image.flaticon.com/icons/svg/105/105220.svg', // 愛心
  'https://image.flaticon.com/icons/svg/105/105212.svg', // 方塊
  'https://image.flaticon.com/icons/svg/105/105219.svg' // 梅花
]

const view = {
  getCardElement(index) {
    return `
      <div class="card back" data-index=${index}>
      </div>
    `
  },
  getCardContent(index) {
    const symbol = Symbols[Math.floor(index / 13)]
    const number = this.transformNumber(index % 13 + 1)
    return `<p>${number}</p>
        <img src=${symbol} alt="">
        <p>${number}</p>`
  },
  transformNumber(number) {
    switch (number) {
      case 1:
        return "A"
        break;
      case 11:
        return "J"
        break;
      case 12:
        return "Q"
        break;
      case 13:
        return "K"
        break;
      default:
        return number
        break;
    }
  },
  displayCards(indexes) {
    const rootElement = document.querySelector("#cards")
    rootElement.innerHTML = indexes.map((index) => this.getCardElement(index)).join("")
  },

  flipCards(...cards) {
    cards.map((card) => {
      if (card.classList.contains("back")) {
        // 回傳正面，如果是背面
        card.classList.remove("back")
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
        return
      } else {
        // 回傳背面，如果是正面
        card.classList.add("back")
        card.innerHTML = null
      }
    })
  },

  pairCards(...cards) {
    cards.map((card) => card.classList.add("paired"))
  },
  renderScore(score) {
    document.querySelector(".score").innerText = `Score: ${score}`
  },
  rendertriedTimes(times) {
    document.querySelector(".tried").innerText = `You've tried: ${times} times`
  },
  renderhintCnt(cnt) {
    document.querySelector("#hint").innerText = `Hint remained: ${cnt}`
  },
  appendWrongAnimation(...cards) {
    cards.map((card) => {
      card.classList.add("wrong")
      card.addEventListener("animationend", event => event.target.classList.remove("wrong"))
    }, { once: true })
  },
  showGameFinished() {
    const div = document.createElement("div")
    div.classList.add("completed")
    div.innerHTML = `
      <p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>
      <a href="./index.html"> <i class="fas fa-redo" style="font-size: 5em; color: #239fe2;position:absolute;top:80px;left:850px;"></i></a >
    `
    const header = document.querySelector('#header')
    header.before(div)
  }
}

const model = {
  revealCards: [],
  score: 0,
  triedTimes: 0,
  hintCnt: 3,
  defaultHintCnt: 3,
  isRevealedCardsMatched() {
    return (this.revealCards[0].dataset.index % 13) === (this.revealCards[1].dataset.index % 13)
  }
}

const controller = {
  currentState: GAME_STATE.FirstCardAwaits,
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(total_cards))
  },

  // 依照不同的遊戲狀態，做不同的行為
  dispatchCardAction(card) {
    if (!card.classList.contains("back"))
      return
    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        model.revealCards.push(card)
        break;
      case GAME_STATE.SecondCardAwaits:
        view.flipCards(card)
        model.revealCards.push(card)
        view.rendertriedTimes(++model.triedTimes)
        if (model.isRevealedCardsMatched()) {
          this.currentState = GAME_STATE.CardsMatched
          view.renderScore(model.score += 10)
          view.pairCards(...model.revealCards)
          // model.revealCards.forEach(card => view.pairCard(card))
          model.revealCards = []
          if (model.score === (260 - 10 * (model.defaultHintCnt - model.hintCnt))) {
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()
            return
          }
          this.currentState = GAME_STATE.FirstCardAwaits
        } else {
          this.currentState = GAME_STATE.CardsMatchFailed
          view.appendWrongAnimation(...model.revealCards)
          setTimeout(this.resetCards, 1000)
        }
        break;
    }
  },
  resetCards() {
    // model.revealCards.forEach((card) => view.flipCard(card))
    view.flipCards(...model.revealCards)
    controller.currentState = GAME_STATE.FirstCardAwaits
    model.revealCards = []
  },
  selectRandomCard(...ranges) {
    let range, selected
    if (ranges.length > 1) {
      range = ranges.length
      selected = ranges[Math.floor(Math.random() * range)]
    } else {
      range = total_cards
      selected = Math.floor(Math.random() * range)
    }
    let node = document.querySelector('.card[data-index="' + selected + '"]')
    while (!node.classList.contains("back")) {
      if (ranges.length > 1) {
        selected = ranges[Math.floor(Math.random() * range)]
      } else {
        selected = Math.floor(Math.random() * total_cards)
      }
      node = document.querySelector('.card[data-index="' + selected + '"]')
    }
    return node
  },
  selectMatchedCard(index) {
    let arr = []
    const base = index % 13
    for (let i = 0; i < 4; i++) {
      let choice = 13 * i + base
      if (choice !== index)
        arr.push(choice)
    }
    return controller.selectRandomCard(...arr)
    // let selected = Math.floor(Math.random() * arr.length)
    // let node = document.querySelector('.card[data-index="' + arr[selected] + '"]')
    // while (!node.classList.contains("back")) {
    //   console.log("duplicate!!! ", arr[selected])
    //   arr.splice(selected, 1)
    //   console.log(arr)
    //   selected = Math.floor(Math.random() * arr.length)
    //   node = document.querySelector('.card[data-index="' + arr[selected] + '"]')
    // }
    // return node
  },
  hintHandler() {
    if (model.hintCnt === 0)
      return
    view.renderhintCnt(--model.hintCnt)
    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        this.dispatchCardAction(this.selectRandomCard(total_cards))
        break;
      case GAME_STATE.SecondCardAwaits:
        model.score -= 10
        this.dispatchCardAction(this.selectMatchedCard(Number(model.revealCards[0].dataset.index)))
        break;
      default:
        return
    }
  }
}

const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    for (let ind = number.length - 1; ind > 0; ind--) {
      let randNum = Math.floor(Math.random() * ind);
      [number[ind], number[randNum]] = [number[randNum], number[ind]]
    }
    return number
  }
}

controller.generateCards()

document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", event => {
    controller.dispatchCardAction(card)
  })
})

document.querySelector(".info").addEventListener("click", event => {
  controller.hintHandler()
})
