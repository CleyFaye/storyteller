/** Build an empty chapter part */
const buildNewChapterPart = (partDef) => ({
  type: PartTypes.chapter.identifier,
  title: partDef.title,
  variants: partDef.variants || [],
});

/** Duplicate content into a new object */
const loadChapterIntoContext = (partData) => ({
  partType: PartTypes.chapter.identifier,
  partTitle: partData.title,
  partVariants: partData.variants.slice(),
});

/** Return the part object from contextData */
const saveChapterFromContext = (contextData) => ({
  type: "chapter",
  title: contextData.partTitle,
  variants: contextData.partVariants.slice(),
});

const isChapterDifferent = (partData, contextData) => {
  if (partData.title != contextData.partTitle) {
    return true;
  }
  if (partData.variants.length != contextData.partVariants.length) {
    return true;
  }
  for (let i = 0; i < partData.variants.length; ++i) {
    if (partData.variants[i] != contextData.partVariants[i]) {
      return true;
    }
  }
  return false;
};

const exportChapter = (partData) => ({
  title: partData.title,
  type: partData.type,
  variants: partData.variants,
});

const getChapterTitle = (partData) =>
  `${partData.title} (${partData.variants.length} ` +
  `variant${partData.variants.length > 1 ? "s" : ""})`;

/** Possible part types */
export const PartTypes = {
  chapter: {
    // Identifier to save into file/object
    identifier: "chapter",
    // Function to create an empty chapter part
    buildNew: buildNewChapterPart,
    // Convert an existing part into a "context" object containing a copy of the
    // content.
    loadIntoContext: loadChapterIntoContext,
    // Update a part using data from an editor context
    saveFromContext: saveChapterFromContext,
    // Export a JSON-serializable object that can be provided to recreate the
    // part.
    export: exportChapter,
    // Check if a context state is different from the stored part (=if it need
    // to be saved)
    isDifferent: isChapterDifferent,
    // Get a display title for editor UI
    getTitle: getChapterTitle,
  },
};

const getPartType = (partType) => {
  const partTypeDef = PartTypes[partType];
  if (partTypeDef === undefined) {
    throw new Error(`Unknown part type: "${partType}"`);
  }
  return partTypeDef;
};

/** Create a new empty part from a basic definitions */
export const buildNew = (partDef) => getPartType(partDef.type).buildNew(partDef);

/** Create a clone of a part */
export const loadIntoContext = (partDef) => getPartType(partDef.type).loadIntoContext(partDef);

/** Save part content from an editor context.
 *
 * @param {Object} contextData
 * The udpated data from loadIntoContext()
 *
 * @return {Object}
 * The part to save
 */
export const saveFromContext = (contextData) => {
  const partTypeDef = getPartType(contextData.partType);
  return partTypeDef.saveFromContext(contextData);
};

/** Return a serializable object, suitable to recreate the part later
 *
 * @param {Object} part
 *
 * @return {Object}
 */
export const exportPart = (part) => getPartType(part.type).export(part);

/** Determine if an editor context need to be saved
 *
 * @param {Object} part
 * Part from the projectCtx
 *
 * @param {Object} contextData
 * Updated value from loadIntoContext()
 *
 * @return {bool}
 * true if the context needs to be saved
 */
export const isDifferent = (part, contextData) => {
  if (!part || part.type != contextData.partType) {
    return true;
  }
  const partTypeDef = getPartType(part.type);
  return partTypeDef.isDifferent(part, contextData);
};

export const getTitle = (partData) => {
  const partTypeDef = getPartType(partData.type);
  return partTypeDef.getTitle(partData);
};
