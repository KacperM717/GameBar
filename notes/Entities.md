# List of Entities needed:

## User

Values:

- id
- role?
- created_at
- email
- password
- nickname
- isRegistered
- isVerified
- level / rank

## Friends/Block List

Probably these two can be merged into one list of RelationList with values: 0 - none, 1 - friend, 2 - blocked

FriendsList - doc for each user - `User.id`

- `User.id` []

BlockList - doc for each user - `User.id`

- `User.id` []

## Rankings

Each game has its own ranking based on ...(insert rules here)...

Game rank - list of `User.id`s with associated number

## Stats

Each game gather its own stats e.g. Volleball counts number of ball touches

## Games

Few games that (hopefully) are going to be playable within two weeks:

- Volleyball

  - 1v1 or 2v2
  - Basic physics
  - Ball as only dynamic entity except players
  - BBox (World)
  - Pole (well kinda tempting to make it dynamic too)
  - Rules
    - Score is considered when ball touches ground
    - 10 or 15 or 20 points win game
    - Number of touches for each player is limited to 3? Resets when enemy hits the ball
    -
  - Stats
    - How many balls touched
    - Number of jumps
    - Scored points
    - Points conceded
  - Player Events
    - Move Left
    - Move Right
    - Jump

- Sumhalla:
  - 1v1 or 2v2 or 1v1v1v1
  - Basic physics
  - Players dynamic objects
  - BBox
  - Platforms (dynamic?)
  - Rules
    - 10 or 15 points
    - Score when Player knocks off other Player
    - HP is reduced when damage is dealt
  - Stats
    - How many hits
    - How many kills
    - How many deaths
    - How many jumps
    - How many dodged attacks
  - Player events
    - Move left
    - Move right
    - Jump
    - Hit
    - Dodge?

Regarding AI learning, whole Stat & Game design needs to be reconstructed. I wanted games to be constantly changing but it is something that makes learning harder... Gotta go grubo or wcale as my sister-in-law says.
Whenever player emit event take a snapshot? With debouncing or continous?
