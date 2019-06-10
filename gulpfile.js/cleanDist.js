const del = require("del");
const { settings, paths } = require("./index");
/**
 * Gulp Tasks
 */
// Remove pre-existing content from output folders
function cleanDist(done) {
  // Make sure this feature is activated before running
  if (!settings.clean)
    return done();
  // Clean the dist folder
  del.sync([paths.output]);
  // Signal completion
  return done();
}
exports.cleanDist = cleanDist;
