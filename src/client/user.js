KNOCKOUT.User = {}

KNOCKOUT.User.States =
{ anonymous: {}
, alive:     {}
, dead:      {}
}

// User Constructor
KNOCKOUT.User.create = function()
{
  var user = 
  { id: -1
  , name: ''
  , state: ''
  }

  user.changeState = function(newState)
  {
    
  }

  user.setName = function(newName)
  {
    user.name = newName

    KNOCKOUT.Events.trigger(KNOCKOUT.Events.USER_RENAMED)
  }

  return user
}