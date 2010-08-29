KNOCKOUT.Events = {};

KNOCKOUT.Events.USER_RENAMED = 'user.renamed'

KNOCKOUT.Events.trigger = function(eventType)
{
  // Pick a better top-level element to bind and trigger events from
  jQuery('body').trigger(eventType)
}