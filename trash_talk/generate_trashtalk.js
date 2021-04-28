function generatetrashtalk(option) {
  const task = {
    engineer: ['加個按鈕', '加新功能', '切個版', '改一點 code'],
    designer: ['畫一張圖', '改個 logo', '順便幫忙設計一下', '隨便換個設計'],
    entrepreneur: ['週末加班', '要能賺錢', '想個 business model', '找 VC 募錢']
  }
  const phrase = ['很簡單', '很容易', '很快', '很正常']
  let trashtalk = []
  const required = Object.keys(option)
  for (item of required) {
    if (task[item]) {
      let taskindex = Math.floor(Math.random() * task[item].length)
      let phraseindex = Math.floor(Math.random() * phrase.length)
      trashtalk.push(`身為一個${item}，${task[item][taskindex]}，${phrase[phraseindex]}`)
    }
  }
  return trashtalk
}

// export function for other files to use
module.exports = generatetrashtalk