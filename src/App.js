import { useState } from "react"
import './index.css';

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: 0,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 0,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return <button onClick={onClick} className="button">{children}</button>
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends)
  const [showAddFriend, SetShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null)

  function handleShowAddFriend() {
    SetShowAddFriend(show => !show)
  }

  function addFriendHandler(newFriend) {
    setFriends(friends => [...friends, newFriend])
    SetShowAddFriend(false)
  }

  function selectFriend(friend) {
    setSelectedFriend(selected => selected?.id === friend.id ? '' : friend)
    SetShowAddFriend(false)
  }

  function splitHandler(value) {
    console.log(value);
    setFriends(friends =>
      friends.map(friend =>
        friend.id === selectedFriend.id ?
          { ...friend, balance: friend.balance + value } : friend))

    setSelectedFriend(null)
  }
  return (
    <div className="app">

      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelectFriend={selectFriend}
        />

        {showAddFriend &&
          <AddFriend
            onAddHandler={addFriendHandler}
          />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? 'Close' : "Add Friend"}
        </Button>

      </div>

      {selectedFriend &&
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitHandler={splitHandler}
        />}
    </div>
  );
}

function FriendsList({ friends, onSelectFriend, selectedFriend }) {
  return <ul>

    {friends.map(friend =>
      <Friend
        friend={friend}
        key={friend.id}
        selectedFriend={selectedFriend}
        onSelectFriend={onSelectFriend}
      />
    )}
  </ul>
}

function Friend({ friend, onSelectFriend, selectedFriend }) {

  const isSelected = selectedFriend?.id == friend.id

  return <li className={isSelected ? 'selected' : ''}>
    <img src={friend.image} alt={friend.name} />
    <h3>{friend.name}</h3>

    {friend.balance < 0 && (
      <p className="red">
        You owe {friend.name} {Math.abs(friend.balance)}$
      </p>
    )}
    {friend.balance > 0 && (
      <p className="green">
        {friend.name}  owes You {friend.balance}$
      </p>
    )}
    {friend.balance === 0 && (
      <p>
        You owe {friend.name} are even
      </p>
    )}

    <Button onClick={() => onSelectFriend(friend)}> {!isSelected ? 'select' : 'close'} </Button>

  </li>
}

function AddFriend({ onAddHandler }) {
  const [name, setName] = useState('')
  const [image, setImage] = useState('https://i.pravatar.cc/48')

  function submitHandler(e) {
    e.preventDefault()

    if (!name || !image) return

    const id = crypto.randomUUID()
    const newFriend = {
      name,
      image,
      balance: 0,
      id
    }

    onAddHandler(newFriend)
    setName('')
    setImage('https://i.pravatar.cc/48')
  }
  return (
    <form className="form-add-friend" onSubmit={submitHandler}>

      <label>👩🏻‍🤝‍🧑Friend Name </label>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <label>📸Image URL </label>
      <input
        type="text"
        value={image}
        onChange={e => setImage(e.target.value)}
      />

      <Button>
        Add
      </Button>
    </form>
  )
}

function FormSplitBill({ selectedFriend, onSplitHandler }) {

  const [bill, setBill] = useState('')
  const [paidByUser, setPaidByUser] = useState('')
  const paidByFriend = bill ? bill - paidByUser : ''
  const [whoPaying, setWhoPaying] = useState('user')

  function submitHandler(e) {
    e.preventDefault()

    if (!bill || !paidByUser) return
    const valueSplit = whoPaying === 'user' ? paidByFriend : -paidByUser
    onSplitHandler(valueSplit)
  }


  return <form className="form-split-bill" onSubmit={submitHandler}>
    <h2>Split a bill with {selectedFriend.name}</h2>

    <label>💰Bill value</label>
    <input type="text" value={bill} onChange={e => setBill(Number(e.target.value))} />

    <label>💵Your expense</label>
    <input type="text" value={paidByUser} onChange={e => setPaidByUser(Number(e.target.value) > bill ? paidByUser : Number(e.target.value))} />

    <label>💸{selectedFriend.name} expense</label>
    <input type="text" disabled value={paidByFriend} />

    <label>💲   Who is paying the bill?</label>
    <select value={whoPaying} onChange={e => setWhoPaying(e.target.value)} >
      <option value="user">You</option>
      <option value="friend">{selectedFriend.name}</option>
    </select>

    <Button >Split bill</Button>
  </form>
}


