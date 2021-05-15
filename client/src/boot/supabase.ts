import { boot } from 'quasar/wrappers';
import useSupabase from 'src/composables/useSupabase';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(() => {
  // something to do
  useSupabase().initSupabase();
});
