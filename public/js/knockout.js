var KNOCKOUT = NKO = {}

KNOCKOUT.Constants = {};

KNOCKOUT.User = {}

KNOCKOUT.User.States =
{ anonymous: {}
, alive:     {}
, dead:      {}
}

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

    jQuery('').trigger('user.name_changed')
  }

  return user
}
