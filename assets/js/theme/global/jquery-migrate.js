// Needed because we use Foundation 5.5, which expects jQuery 2.x. However,
// rather than bringing in all of jquery-migrate, we're cherry picking individual
// fixes needed for Foundation.
import init from './jquery-migrate/init';
import traversing from './jquery-migrate/traversing';
import data from './jquery-migrate/data';
import events from './jquery-migrate/event';

init();
traversing();
data();
events();
