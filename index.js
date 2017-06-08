export function render () {
  return { replace: '' }
}

export function mount (ctx, props, el) {
  if (process.env.PENGUIN_ENV === 'production') return
  const { timeout = 2000 } = props
  const update = (hidden = true) => {
    const display = hidden ? 'none' : ''
    if (display !== el.style.display) el.style.display = display
  }
  const uiStore = UIStore({
    onShow: update.bind(null, false),
    onHide: update.bind(null, true),
    timeout
  })
  update()
  ctx.store.subscribe(() => uiStore(ctx.store.getState()))
}

function UIStore ({ timeout, onShow, onHide }) {
  let state = false
  let currentID = 0
  let timer = null
  return ({ isPublishing: s, error }) => {
    if (state && !s && !error) startTimer(++currentID)
    state = s
  }

  function startTimer (id) {
    if (timer) clearTimeout(timer)
    onShow()
    timer = setTimeout(() => {
      if (currentID === id) onHide()
    }, timeout)
  }
}
