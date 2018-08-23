# BambooDGame

BambooDGame is a social decentralized game running on Etherium blockchain, appropriate to play on events for connecting people, creating networking opportunities and increasing attendee engagement.

Current implementation there till is game master role to setup the game, but some changes could be make to minimize the amount of trust required.

## Gameplay

0.  Setup

    The game master deploy the contract with the choosen params:

    * `MaxLength`: Depend on how many attendees you expect to join the game. Usually, the bigger `MaxLength` will make the game take more time to finish. Typical length is around `<number of attendees> / 10`.
    
    * `X` and `Y` (0 &le; X < Y &le; 20): These values will be use to generate `knotNumber` from player address. 

    In the later versions, these params may be set after the checkin phase is finished to prevent attendees from chosing their `knotNumber`.

1.  Checkin

    Attendees call `checkIn` to become players. Each player will be assign a `knotNumber` base on there address.

2.  Joint

    The mission of players is to find others with consecutive knots and form a `bamboo` with the most knots. A player with knot number `k` may connect to a `k - 1` knot and a `k + 1` knot. A `joint` is only valid if there are connection from both sides.

    This game is a social game because it requires social interaction between players. Players need to make conversations in real live, and are encouraged to strengthen their group to prevent betrayal.

3.  Victory conditions

    When there is a group reach max length, we call it [Dragon Bamboo](https://en.wikipedia.org/wiki/Dendrocalamus_giganteus), the game will end immediately and that group is the winner.

    When the event is ended, game master may call `stop`. The group with the most knots at the time is the winner. If there are multi groups with the length, the first one reach that length will be choosen.

    Prize distribution is currently not built-in.

## Variant

- This game may be held as a pre-event at hackathon to form random teams. We need to change the `knotNumber` function to equally generation.

- We may disallow breaking joints to make the game more friendly (no traitor, no plot).

- We may require enter fee and distribute that for the winners. That make the game more like stake game.

## Installation

```bash
$ git clone
$ cd 
$ embark run
```

Go to `http://localhost:8000/`

## Misc

The name comes from a Vietnamese fable, [The Hundred-knot Bamboo Tree](https://en.wikipedia.org/wiki/The_Hundred-knot_Bamboo_Tree)