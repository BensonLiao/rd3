import lorem from 'lorem-ipsum'

const defaultState = {
  text: {
    user1: lorem(),
    user2: lorem()
  }
}

function rootReducer (state = defaultState, action) {
  switch (action.type) {
    default:
      return state
  }
}

export default rootReducer