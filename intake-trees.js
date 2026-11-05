/*
  Miller Hardware saw shop: intake question trees.
  One file feeds both the Saw Shop app (counter intake) and the website's service request form.
  The counter gathers facts and does safe checks only. It never names a cause.

  How a question works:
    q      the question as staff read it at the counter
    cq     the same question in customer words (website). Leave out to reuse q.
    who    'counter' = only asked in the shop (hands-on checks, what's left with it). Skipped on the website.
    check  true = the answer also shows in the tech's "Counter checks" list
    multi  true = pick all that apply
    text   true = typed answer only
    say    words put in front of the answer in the summary sentence
    opts   answers: l = label, s = words for the summary sentence, n = next question,
           warn = flag it for the tech, quick = quick lane (sharpen-only style jobs)
    next   where to go after a multi/text answer, "Not sure" or "Something else"
           'END' finishes. Every question offers "Not sure" and "Something else" automatically.
*/
(function () {
  "use strict";

  // ---------- building blocks used by several trees ----------
  function lastRan(next) {
    return { q: "When did it last run?", cq: "When did it last run?", next: next, opts: [
      { l: "This week", s: "Last ran this week" }, { l: "This month", s: "Last ran this month" },
      { l: "Over a month ago", s: "Last ran over a month ago" }, { l: "Over 6 months ago", s: "Last ran over 6 months ago" }] };
  }
  function fuelAge(next) {
    return { q: "How old is the gas in it?", cq: "How old is the gas in it?", next: next, opts: [
      { l: "Under 30 days", s: "Fuel under 30 days old" }, { l: "Over 30 days", s: "Fuel over 30 days old", warn: true },
      { l: "Don't know", s: "Fuel age unknown" }] };
  }
  function fuelType(next) {
    return { q: "What gas do they run in it?", cq: "What gas do you use in it?", next: next, opts: [
      { l: "Premixed can", s: "Uses premixed fuel" }, { l: "Mixed at home", s: "Mixes fuel at home" },
      { l: "Straight gas, by mistake", s: "May have run straight gas (no oil)", warn: true }] };
  }
  function howLong(next) {
    return { q: "How long has this been going on?", next: next, opts: [
      { l: "Just started", s: "Problem just started" }, { l: "A few weeks", s: "Going on a few weeks" },
      { l: "Longer", s: "Going on a while" }] };
  }
  function happened(next, extra) {
    return { q: "Did anything happen before it started?", cq: "Did anything happen right before the problem started?", multi: true, say: "Before it started: ", next: next,
      opts: extra.map(function (x) { return { l: x, s: x.toLowerCase() }; }).concat([{ l: "Nothing they know of", s: "nothing they know of" }]) };
  }
  function batteryWhat(next, extra) {
    return { q: "What's it doing?", cq: "What's it doing?", multi: true, say: "Battery unit: ", next: next,
      opts: [{ l: "Won't turn on", s: "won't turn on" }, { l: "Runs, then stops", s: "runs then stops" }, { l: "Weak", s: "weak" }]
        .concat((extra || []).map(function (x) { return { l: x, s: x.toLowerCase() }; }))
        .concat([{ l: "Charger problem", s: "charger problem" }]) };
  }
  function batteryLights(next) {
    return { q: "Do the battery lights come on, and does it charge all the way?", next: next, opts: [
      { l: "Yes, charges full", s: "Battery lights on and charges full" },
      { l: "Lights, but won't charge full", s: "Battery won't charge full", warn: true },
      { l: "No lights", s: "No battery lights", warn: true }] };
  }
  function batteryOther(next) {
    return { q: "Have they tried another battery?", cq: "Have you tried a different battery in it?", next: next, opts: [
      { l: "Yes, same problem", s: "Same problem with another battery" }, { l: "Yes, works with the other one", s: "Works with a different battery" },
      { l: "No", s: "Hasn't tried another battery" }] };
  }
  function charger(next) {
    return { q: "Does the charger light up?", cq: "Does the charger light up?", next: next, opts: [
      { l: "Yes, normal", s: "Charger lights normally" }, { l: "Gets hot", s: "Charger gets hot", warn: true },
      { l: "No lights", s: "Charger shows no lights", warn: true }] };
  }
  function batteryModel(next) {
    return { q: "Battery model or voltage, if they know it", cq: "Battery model or voltage, if you know it", text: true, say: "Battery: ", next: next };
  }
  function batteryLeft(next) {
    return { q: "Are the battery and charger being left with it?", who: "counter", check: true, short: "Battery and charger left", next: next, opts: [
      { l: "Both", s: "Battery and charger left with it" }, { l: "Battery only", s: "Battery left, no charger" },
      { l: "Neither", s: "No battery or charger left", warn: true }] };
  }
  function ropeCheck(next, noPullNext, hint) {
    return { q: "Check: pull the rope gently. How does it pull?" + (hint ? " (" + hint + ")" : ""), who: "counter", check: true, short: "Rope pull", next: next, opts: [
      { l: "Won't pull", s: "Rope won't pull", warn: true, n: noPullNext || next },
      { l: "Hard or jerky", s: "Rope pulls hard or jerky", warn: true },
      { l: "Pulls normally", s: "Rope pulls normally" }] };
  }
  function leftWith(items) {
    return { q: "What's being left with it?", who: "counter", multi: true, say: "Left with ", next: "photo",
      opts: items.map(function (x) { return { l: x, s: x.toLowerCase() }; }).concat([{ l: "Nothing extra", s: "nothing extra" }]) };
  }
  function photo(what) {
    return { q: "Take a photo of the " + what + " in the Photos section of this form.", who: "counter", info: true, next: "END" };
  }

  // ---------- the trees ----------
  var T = {};

  T.chainsaw = { label: "Chainsaw", start: "reason", nodes: {
    reason: { q: "What brought it in today?", cq: "What do you need done?", next: "power", opts: [
      { l: "Sharpen chain only", s: "Chain sharpening only", quick: true, n: "END" },
      { l: "Tune-up or service, no problem", s: "In for a tune-up, no problem reported", n: "left" },
      { l: "Something's wrong", s: "", n: "power" }] },
    power: { q: "Gas or battery?", next: "starts", opts: [{ l: "Gas", s: "", n: "starts" }, { l: "Battery", s: "Battery saw", n: "bat_what" }] },
    starts: { q: "Does it start?", next: "rope", opts: [{ l: "Yes", s: "Starts", n: "keeps" }, { l: "No", s: "Won't start", n: "rope" }] },
    rope: ropeCheck("lastran"),
    lastran: lastRan("fuelage"), fuelage: fuelAge("fueltype"), fueltype: fuelType("tank"),
    tank: { q: "Check: is there fuel in the tank?", who: "counter", check: true, short: "Fuel in tank", next: "howlong", opts: [
      { l: "Yes", s: "Fuel in tank" }, { l: "Empty", s: "Tank empty", warn: true }] },
    keeps: { q: "Does it keep running?", next: "use", opts: [
      { l: "Runs fine until I use it", s: "Runs until put to work", n: "use" },
      { l: "Quits on its own", s: "Quits on its own", n: "quitwhen" }] },
    quitwhen: { q: "How long before it quits?", next: "restart", opts: [
      { l: "Seconds", s: "after a few seconds" }, { l: "A few minutes", s: "after a few minutes" }, { l: "Once it's warm", s: "once warm" }] },
    restart: { q: "Will it restart?", next: "use", opts: [
      { l: "Right away", s: "Restarts right away" }, { l: "Only after it cools", s: "Restarts only after cooling" }, { l: "No", s: "Won't restart", warn: true }] },
    use: { q: "What happens when it's used? Pick all that apply.", cq: "What happens when you use it? Pick all that apply.", multi: true, say: "When used: ", next: "howlong", opts: [
      { l: "Bogs or loses power cutting", s: "bogs or loses power cutting" }, { l: "Chain spins at idle", s: "chain spins at idle", warn: true },
      { l: "Chain won't spin", s: "chain won't spin" }, { l: "Cuts slow or crooked", s: "cuts slow or crooked" },
      { l: "Smokes", s: "smokes" }, { l: "Chain throws off or goes loose", s: "chain throws off or goes loose" },
      { l: "Leaks fuel or bar oil", s: "leaks fuel or bar oil" }, { l: "Bar or chain not getting oil", s: "bar or chain not getting oil" },
      { l: "Strange noise", s: "makes a strange noise" }] },
    howlong: howLong("happened"),
    happened: happened("left", ["Dropped", "Hit something", "Ran out of bar oil", "Sat over winter", "Got wet", "Someone worked on it"]),
    left: leftWith(["Bar", "Chain", "Scabbard", "Case", "Extra chains", "Battery", "Charger"]),
    photo: photo("serial plate and any damage"),
    bat_what: batteryWhat("bat_lights", ["Chain won't spin", "Bar not oiling"]),
    bat_lights: batteryLights("bat_other"), bat_other: batteryOther("charger"), charger: charger("bat_model"),
    bat_model: batteryModel("bat_left"), bat_left: batteryLeft("use")
  } };

  T.trimmer = { label: "String trimmer", start: "reason", nodes: {
    reason: { q: "What brought it in today?", cq: "What do you need done?", next: "power", opts: [
      { l: "New head or line only", s: "New head or line only", quick: true, n: "END" },
      { l: "Tune-up, no problem", s: "In for a tune-up, no problem reported", n: "left" },
      { l: "Something's wrong", s: "", n: "power" }] },
    power: { q: "Gas or battery?", next: "starts", opts: [{ l: "Gas", s: "", n: "starts" }, { l: "Battery", s: "Battery trimmer", n: "bat_what" }] },
    starts: { q: "Does it start?", next: "rope", opts: [{ l: "Yes", s: "Starts", n: "runs" }, { l: "No", s: "Won't start", n: "rope" }] },
    rope: ropeCheck("lastran", "howlong"),
    lastran: lastRan("fuelage"), fuelage: fuelAge("fueltype"), fueltype: fuelType("demo"),
    demo: { q: "Have the customer show how they start it (choke, primer, switch). What did you see?", who: "counter", check: true, short: "Starting demo", next: "howlong", opts: [
      { l: "They start it correctly", s: "Customer starts it correctly" }, { l: "Choke or primer used wrong", s: "Choke or primer used wrong", warn: true },
      { l: "Switch was off", s: "Switch was off", warn: true }, { l: "Didn't demo", s: "No starting demo" }] },
    runs: { q: "How does it run? Pick all that apply.", cq: "How does it run? Pick all that apply.", multi: true, say: "Runs: ", next: "howlong", opts: [
      { l: "Quits after a while", s: "quits after a while" }, { l: "Bogs or no power at full throttle", s: "bogs at full throttle" },
      { l: "Head spins at idle", s: "head spins at idle", warn: true }, { l: "Head won't spin", s: "head won't spin" },
      { l: "Line won't feed or keeps breaking", s: "line won't feed or keeps breaking" },
      { l: "Shaft or head vibrates or is noisy", s: "shaft or head vibrates or is noisy" }, { l: "Smokes or leaks", s: "smokes or leaks" }] },
    howlong: howLong("happened"),
    happened: happened("left", ["Dropped", "Sat over winter", "Wrong fuel", "Someone worked on it"]),
    left: leftWith(["Bump-feed head", "Fixed-line head", "Blade", "Attachments", "Battery", "Charger"]),
    photo: photo("serial plate and any damage"),
    bat_what: batteryWhat("bat_lights", ["Head won't spin"]),
    bat_lights: batteryLights("bat_other"), bat_other: batteryOther("charger"), charger: charger("bat_model"),
    bat_model: batteryModel("bat_left"), bat_left: batteryLeft("howlong")
  } };

  T.blower = { label: "Blower", start: "reason", nodes: {
    reason: { q: "What brought it in today?", cq: "What do you need done?", next: "style", opts: [
      { l: "Tune-up, no problem", s: "In for a tune-up, no problem reported", n: "left" },
      { l: "Something's wrong", s: "", n: "style" }] },
    style: { q: "Handheld, backpack or walk-behind?", next: "power", opts: [
      { l: "Handheld", s: "Handheld blower" }, { l: "Backpack", s: "Backpack blower" }, { l: "Walk-behind", s: "Walk-behind blower" }] },
    power: { q: "Gas or battery?", next: "starts", opts: [{ l: "Gas", s: "", n: "starts" }, { l: "Battery", s: "Battery unit", n: "bat_what" }] },
    starts: { q: "Does it start?", next: "rope", opts: [{ l: "Yes", s: "Starts", n: "runs" }, { l: "No", s: "Won't start", n: "rope" }] },
    rope: ropeCheck("lastran", "howlong"),
    lastran: lastRan("fuelage"), fuelage: fuelAge("fueltype"), fueltype: fuelType("howlong"),
    runs: { q: "How does it run? Pick all that apply.", cq: "How does it run? Pick all that apply.", multi: true, say: "Runs: ", next: "howlong", opts: [
      { l: "Quits after a while", s: "quits after a while" }, { l: "Weak air or bogs at full throttle", s: "weak air or bogs at full throttle" },
      { l: "Won't idle", s: "won't idle" }, { l: "Throttle sticks or won't return", s: "throttle sticks", warn: true },
      { l: "Rattling or scraping noise", s: "rattling or scraping noise" }, { l: "Smokes or leaks", s: "smokes or leaks" },
      { l: "Backpack harness or straps broken", s: "harness or straps broken" }] },
    howlong: howLong("happened"),
    happened: happened("left", ["Dropped", "Sucked something in", "Sat over winter", "Wrong fuel"]),
    left: leftWith(["Tubes", "Nozzles", "Gutter kit", "Battery", "Charger"]),
    photo: photo("serial plate and any damage"),
    bat_what: batteryWhat("bat_lights"), bat_lights: batteryLights("bat_other"), bat_other: batteryOther("charger"),
    charger: charger("bat_model"), bat_model: batteryModel("bat_left"), bat_left: batteryLeft("runs")
  } };

  T.pushmower = { label: "Push mower", start: "reason", nodes: {
    reason: { q: "What brought it in today?", cq: "What do you need done?", next: "power", opts: [
      { l: "Blade sharpening only", s: "Blade sharpening only", quick: true, n: "END" },
      { l: "Tune-up, no problem", s: "In for a tune-up, no problem reported", n: "left" },
      { l: "Something's wrong", s: "", n: "power" }] },
    power: { q: "Gas or battery? Push or self-propelled?", next: "starts", opts: [
      { l: "Gas, push", s: "Gas push mower", n: "starts" }, { l: "Gas, self-propelled", s: "Gas self-propelled mower", n: "starts" },
      { l: "Battery, push", s: "Battery push mower", n: "bat_what" }, { l: "Battery, self-propelled", s: "Battery self-propelled mower", n: "bat_what" }] },
    starts: { q: "Does it start?", next: "rope", opts: [{ l: "Yes", s: "Starts", n: "runs" }, { l: "No", s: "Won't start", n: "rope" }] },
    rope: ropeCheck("lastran", "howlong", "blade lever held"),
    lastran: lastRan("fuelage"), fuelage: fuelAge("fueloil"),
    fueloil: { q: "Check: fuel in the tank? Oil on the dipstick? Pick all that apply.", who: "counter", check: true, multi: true, short: "Fuel and oil", say: "", next: "howlong", opts: [
      { l: "Fuel in tank", s: "fuel in tank" }, { l: "Tank empty", s: "tank empty", warn: true },
      { l: "Oil on dipstick", s: "oil on dipstick" }, { l: "Oil low or none", s: "oil low or none", warn: true }] },
    runs: { q: "How does the engine run? Pick all that apply.", cq: "How does it run? Pick all that apply.", multi: true, say: "Runs: ", next: "mowing", opts: [
      { l: "Quits after a while", s: "quits after a while" }, { l: "Dies in tall or wet grass", s: "dies in tall or wet grass" },
      { l: "Surges or runs rough", s: "surges or runs rough" }, { l: "Smokes", s: "smokes" }, { l: "Leaks gas or oil", s: "leaks gas or oil" },
      { l: "Runs fine", s: "runs fine" }] },
    mowing: { q: "Mowing and drive. Pick all that apply.", cq: "Any trouble mowing or moving it? Pick all that apply.", multi: true, say: "Mowing: ", next: "howlong", opts: [
      { l: "Won't self-propel or slips uphill", s: "won't self-propel or slips uphill" }, { l: "Cuts uneven or leaves strips", s: "cuts uneven" },
      { l: "Vibrates or shakes", s: "vibrates or shakes", warn: true }, { l: "Won't bag or discharge", s: "won't bag or discharge" },
      { l: "Wheels wobble or height won't adjust", s: "wheels wobble or height won't adjust" }, { l: "No mowing problems", s: "no mowing problems" }] },
    howlong: howLong("happened"),
    happened: happened("left", ["Hit a rock or stump", "Tipped over", "Sat over winter", "Someone worked on it"]),
    left: leftWith(["Bagger", "Mulch plug", "Side chute", "Battery", "Charger"]),
    photo: photo("engine and model sticker and any damage"),
    bat_what: batteryWhat("bat_lights"), bat_lights: batteryLights("bat_other"), bat_other: batteryOther("charger"),
    charger: charger("bat_model"), bat_model: batteryModel("bat_left"), bat_left: batteryLeft("mowing")
  } };

  T.riding = { label: "Riding mower or zero-turn", start: "getting", nodes: {
    getting: { q: "How is it getting here?", who: "counter", next: "reason", opts: [
      { l: "Dropped off now", s: "" }, { l: "We pick it up", s: "We pick it up", n: "pickup" },
      { l: "They'll bring it later", s: "Customer bringing it later" }] },
    pickup: { q: "Pickup details: address, gate code, where it sits", text: true, say: "Pickup: ", next: "reason" },
    reason: { q: "What brought it in?", cq: "What do you need done?", next: "crank", opts: [
      { l: "Tune-up or blade service, no problem", s: "In for a tune-up or blade service, no problem reported", n: "hours" },
      { l: "Something's wrong", s: "", n: "crank" }] },
    crank: { q: "What happens when the key is turned?", cq: "What happens when you turn the key?", next: "engine", opts: [
      { l: "Nothing at all", s: "Nothing happens at the key", n: "lastcharged" }, { l: "Clicks only", s: "Clicks only at the key", n: "lastcharged" },
      { l: "Cranks but won't start", s: "Cranks but won't start", n: "fuelage" }, { l: "Starts", s: "Starts", n: "engine" }] },
    lastcharged: { q: "Was the battery kept charged while it sat?", cq: "Was the battery kept charged while it sat?", next: "lastran", opts: [
      { l: "Yes", s: "Battery kept charged" }, { l: "No", s: "Battery not kept charged" }, { l: "Battery is new", s: "Battery is new" }] },
    lastran: lastRan("safety"),
    safety: { q: "When starting: on the seat, brake set, blades off?", cq: "When you try to start it, are you on the seat with the brake set and blades off?", next: "howlong", opts: [
      { l: "Yes, all three", s: "Seat, brake and blades set right when starting" }, { l: "No, not always", s: "Safety switches may not be set when starting", warn: true }] },
    fuelage: fuelAge("lastran2"), lastran2: lastRan("howlong"),
    engine: { q: "Engine. Pick all that apply.", cq: "How does the engine run? Pick all that apply.", multi: true, say: "Engine: ", next: "drive", opts: [
      { l: "Quits after a while", s: "quits after a while" }, { l: "Dies when blades engage", s: "dies when blades engage" },
      { l: "Surges, runs rough or backfires", s: "surges, runs rough or backfires" }, { l: "Smokes", s: "smokes" },
      { l: "Leaks gas, oil or hydraulic fluid", s: "leaks gas, oil or hydraulic fluid", warn: true }, { l: "Runs fine", s: "runs fine" }] },
    drive: { q: "Drive and steering. Pick all that apply.", cq: "Any trouble driving or steering? Pick all that apply.", multi: true, say: "Drive: ", next: "deck", opts: [
      { l: "Won't move, or slow on one side", s: "won't move or slow on one side" }, { l: "Pulls to one side", s: "pulls to one side" },
      { l: "Won't go up hills", s: "won't go up hills" }, { l: "Brakes don't hold", s: "brakes don't hold", warn: true },
      { l: "Drives fine", s: "drives fine" }] },
    deck: { q: "Deck and blades. Pick all that apply.", cq: "Any trouble with the deck or blades? Pick all that apply.", multi: true, say: "Deck: ", next: "howlong", opts: [
      { l: "Blades won't engage", s: "blades won't engage" }, { l: "Belt squeals or comes off", s: "belt squeals or comes off" },
      { l: "Cuts uneven or scalps", s: "cuts uneven or scalps" }, { l: "Vibrates when blades are on", s: "vibrates with blades on", warn: true },
      { l: "Deck is fine", s: "deck is fine" }] },
    howlong: howLong("happened"),
    happened: happened("hours", ["Hit something", "Ran out of gas", "Sat over winter", "Someone worked on it"]),
    hours: { q: "Hours on the meter, if it has one", cq: "Hours on the hour meter, if it has one", text: true, say: "Hours: ", next: "left" },
    left: leftWith(["Bagger", "Mulch kit", "Trailer", "Keys"]),
    photo: photo("serial plate, hour meter and any damage")
  } };

  // Pole saw: a small saw on a shaft. Chain, bar and oiler like a chainsaw, plus the shaft, drive and extension.
  T.polesaw = { label: "Pole saw", start: "reason", nodes: {
    reason: { q: "What brought it in today?", cq: "What do you need done?", next: "power", opts: [
      { l: "Sharpen chain only", s: "Chain sharpening only", quick: true, n: "END" },
      { l: "Tune-up or service, no problem", s: "In for a tune-up, no problem reported", n: "left" },
      { l: "Something's wrong", s: "", n: "style" }] },
    style: { q: "One-piece or a pole saw attachment on a powerhead (Kombi, multi-tool)?", next: "power", opts: [
      { l: "One-piece pole saw", s: "One-piece pole saw" }, { l: "Attachment on a powerhead", s: "Pole saw attachment on a powerhead" }] },
    power: { q: "Gas or battery?", next: "starts", opts: [{ l: "Gas", s: "", n: "starts" }, { l: "Battery", s: "Battery pole saw", n: "bat_what" }] },
    starts: { q: "Does it start?", next: "rope", opts: [{ l: "Yes", s: "Starts", n: "keeps" }, { l: "No", s: "Won't start", n: "rope" }] },
    rope: ropeCheck("lastran", "howlong"),
    lastran: lastRan("fuelage"), fuelage: fuelAge("fueltype"), fueltype: fuelType("howlong"),
    keeps: { q: "Does it keep running?", next: "use", opts: [
      { l: "Runs fine until I use it", s: "Runs until put to work", n: "use" },
      { l: "Quits on its own", s: "Quits on its own", n: "use" }] },
    use: { q: "What happens when it's used? Pick all that apply.", cq: "What happens when you use it? Pick all that apply.", multi: true, say: "When used: ", next: "howlong", opts: [
      { l: "Bogs or loses power cutting", s: "bogs or loses power cutting" }, { l: "Chain spins at idle", s: "chain spins at idle", warn: true },
      { l: "Chain won't spin, engine runs", s: "chain won't spin while engine runs" }, { l: "Cuts slow or crooked", s: "cuts slow or crooked" },
      { l: "Bar or chain not getting oil", s: "bar or chain not getting oil" }, { l: "Chain throws off or goes loose", s: "chain throws off or goes loose" },
      { l: "Shaft or extension loose or rattles", s: "shaft or extension loose or rattles" },
      { l: "Shaft won't extend or lock", s: "shaft won't extend or lock" },
      { l: "Gear head hot, noisy or leaking", s: "gear head hot, noisy or leaking", warn: true },
      { l: "Smokes or leaks", s: "smokes or leaks" }] },
    howlong: howLong("happened"),
    happened: happened("left", ["Dropped", "Bar pinched in a cut", "Hit a wire or fence", "Ran out of bar oil", "Sat over winter", "Someone worked on it"]),
    left: leftWith(["Bar", "Chain", "Scabbard", "Extension pieces", "Powerhead", "Harness", "Battery", "Charger"]),
    photo: photo("serial plate and any damage"),
    bat_what: batteryWhat("bat_lights", ["Chain won't spin", "Bar not oiling"]),
    bat_lights: batteryLights("bat_other"), bat_other: batteryOther("charger"), charger: charger("bat_model"),
    bat_model: batteryModel("bat_left"), bat_left: batteryLeft("use")
  } };

  // Everything else: generators, pressure washers, tillers, splitters, augers, hedge trimmers, edgers, other.
  // "for" limits an answer to certain equipment types.
  T.general = { label: "Other equipment", start: "reason", nodes: {
    reason: { q: "What brought it in today?", cq: "What do you need done?", next: "power", opts: [
      { l: "Sharpen blades only", s: "Blade sharpening only", quick: true, n: "END", "for": ["Hedge Trimmer", "Edger", "Auger"] },
      { l: "Tune-up or service, no problem", s: "In for a tune-up, no problem reported", n: "left" },
      { l: "Something's wrong", s: "", n: "power" }] },
    power: { q: "Gas, battery or plug-in electric?", next: "starts", opts: [
      { l: "Gas", s: "", n: "starts" }, { l: "Battery", s: "Battery unit", n: "elec_what" }, { l: "Plug-in electric", s: "Plug-in electric", n: "elec_what" }] },
    starts: { q: "Does it start?", next: "rope", opts: [{ l: "Yes", s: "Starts", n: "work" }, { l: "No", s: "Won't start", n: "rope" }] },
    rope: ropeCheck("lastran", "howlong"),
    lastran: lastRan("fuelage"), fuelage: fuelAge("oil"),
    oil: { q: "Check: oil on the dipstick (4-stroke engines)?", who: "counter", check: true, short: "Oil", next: "howlong", opts: [
      { l: "Oil looks fine", s: "Oil level OK" }, { l: "Low or none", s: "Oil low or none", warn: true }, { l: "2-stroke, no dipstick", s: "" }] },
    work: { q: "How does it run and work? Pick all that apply.", cq: "How does it run and work? Pick all that apply.", multi: true, say: "Runs: ", next: "howlong", opts: [
      { l: "Quits after a while", s: "quits after a while" }, { l: "Surges or runs rough", s: "surges or runs rough" },
      { l: "No power or bogs under load", s: "bogs under load" }, { l: "Smokes", s: "smokes" }, { l: "Leaks gas or oil", s: "leaks gas or oil" },
      { l: "Strange noise or vibration", s: "strange noise or vibration" },
      { l: "No power at the outlets", s: "no power at the outlets", "for": ["Generator"] },
      { l: "Breaker trips", s: "breaker trips", "for": ["Generator"] },
      { l: "Low or no water pressure", s: "low or no water pressure", "for": ["Pressure Washer"] },
      { l: "Pressure pulses", s: "pressure pulses", "for": ["Pressure Washer"] },
      { l: "Water leaks at pump or hose", s: "water leaks at pump or hose", "for": ["Pressure Washer"] },
      { l: "Tines won't turn", s: "tines won't turn", "for": ["Tiller / Cultivator"] },
      { l: "Wedge won't move or is slow", s: "wedge won't move or is slow", "for": ["Log Splitter"] },
      { l: "Hydraulic leak", s: "hydraulic leak", warn: true, "for": ["Log Splitter"] },
      { l: "Bit won't spin", s: "bit won't spin", "for": ["Auger"] },
      { l: "Blades won't move", s: "blades won't move", "for": ["Hedge Trimmer", "Edger"] },
      { l: "Cuts poorly", s: "cuts poorly", "for": ["Hedge Trimmer", "Edger"] }] },
    elec_what: { q: "What's it doing? Pick all that apply.", cq: "What's it doing? Pick all that apply.", multi: true, say: "Electric unit: ", next: "howlong", opts: [
      { l: "Won't turn on", s: "won't turn on" }, { l: "Runs, then stops", s: "runs then stops" }, { l: "Weak", s: "weak" },
      { l: "Charger problem", s: "charger problem" }, { l: "Cord or plug damaged", s: "cord or plug damaged", warn: true }] },
    howlong: howLong("happened"),
    happened: happened("left", ["Dropped or tipped over", "Sat over winter", "Wrong fuel", "Got wet", "Someone worked on it"]),
    left: leftWith(["Battery", "Charger", "Hoses or wand", "Blades or bits", "Attachments", "Keys"]),
    photo: photo("serial plate and any damage")
  } };

  // Equipment type (as the app and website name it) -> tree
  var MAP = {
    "Chainsaw": "chainsaw", "Trimmer / Weedeater": "trimmer", "Blower": "blower",
    "Mower — Push": "pushmower", "Mower — Riding": "riding", "Zero Turn Mower": "riding", "Pole Saw": "polesaw"
  };

  // ---------- the engine both pages use ----------
  function treeFor(equipType) { return T[MAP[equipType] || "general"]; }
  function treeId(equipType) { return MAP[equipType] || "general"; }
  function slug(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 14); }
  function optsFor(node, equipType) {
    return (node.opts || []).filter(function (o) { return !o["for"] || o["for"].indexOf(equipType) >= 0; });
  }
  // online = website: skip counter-only questions
  function shown(node, online) { return !(online && node.who === "counter"); }
  // Where to go after answering. ans = {pick:[labels], text:"", unsure:true}
  function nextId(node, ans) {
    if (ans && !ans.unsure && !node.multi && !node.text && ans.pick && ans.pick.length) {
      var o = (node.opts || []).filter(function (x) { return x.l === ans.pick[0]; })[0];
      if (o && o.n) return o.n;
    }
    return node.next || "END";
  }
  function firstShown(tree, id, online) {
    var guard = 0;
    while (id && id !== "END" && guard++ < 60) {
      var n = tree.nodes[id]; if (!n) return "END";
      if (shown(n, online)) return id;
      id = n.next || "END";   // skipped questions follow their default path
    }
    return "END";
  }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  // Turn an answer log [{id, pick, text, unsure}] into what the tech reads.
  function summarize(equipType, log) {
    var tree = treeFor(equipType), pieces = [], checks = [], answers = [], quick = false;
    (log || []).forEach(function (a) {
      var n = tree.nodes[a.id]; if (!n) return;
      var picked = (n.opts || []).filter(function (o) { return (a.pick || []).indexOf(o.l) >= 0; });
      if (picked.some(function (o) { return o.quick; })) quick = true;
      var shownAns = a.unsure ? "Not sure" : picked.map(function (o) { return o.l; }).concat(a.text ? [a.text] : []).join(", ");
      if (!n.info) answers.push({ q: n.cq && a.online ? n.cq : n.q, a: shownAns || "-", by: a.online ? "customer" : "counter" });
      if (n.check && !a.unsure) checks.push({ label: n.short || n.q, value: shownAns, warn: picked.some(function (o) { return o.warn; }) });
      if (a.unsure || n.info) return;
      var says = picked.map(function (o) { return o.s; }).filter(Boolean);
      if (a.text) says.push(n.text ? a.text : "other: " + a.text);
      if (!says.length) return;
      if (n.multi) pieces.push(cap((n.say || "") + says.join(", ")));
      else if (n.text) pieces.push((n.say || "") + says.join(" "));
      else if (a.id === "quitwhen") pieces.push("Quits " + says.join(", "));
      else pieces.push(cap(says.join(", ")));
    });
    var sentence = pieces.join(". ").replace(/\.\./g, ".");
    if (sentence && !/[.!?]$/.test(sentence)) sentence += ".";
    return { tree: treeId(equipType), sentence: sentence, checks: checks, answers: answers, quick: quick };
  }
  // Short code line the website adds to its request, so the app can pre-fill the questions.
  function encode(equipType, log) {
    var tree = treeFor(equipType);
    var parts = (log || []).filter(function (a) { return tree.nodes[a.id] && !tree.nodes[a.id].text; }).map(function (a) {
      var n = tree.nodes[a.id];
      var keys = a.unsure ? ["unsure"] : (n.opts || []).filter(function (o) { return (a.pick || []).indexOf(o.l) >= 0; }).map(function (o) { return slug(o.l); });
      return a.id + "=" + keys.join("+");
    });
    return "[intake:" + treeId(equipType) + "|" + parts.join("|") + "]";
  }
  function decode(text) {
    var m = /\[intake:([a-z]+)\|([^\]]*)\]/.exec(String(text || "")); if (!m || !T[m[1]]) return null;
    var tree = T[m[1]], out = {};
    m[2].split("|").forEach(function (p) {
      var kv = p.split("="), n = tree.nodes[kv[0]]; if (!n || !kv[1]) return;
      if (kv[1] === "unsure") { out[kv[0]] = { unsure: true }; return; }
      var keys = kv[1].split("+");
      out[kv[0]] = { pick: (n.opts || []).filter(function (o) { return keys.indexOf(slug(o.l)) >= 0; }).map(function (o) { return o.l; }) };
    });
    return { tree: m[1], answers: out };
  }
  function strip(text) { return String(text || "").replace(/\s*\[intake:[^\]]*\]\s*/g, "").trim(); }

  window.INTAKE = { trees: T, map: MAP, treeFor: treeFor, treeId: treeId, optsFor: optsFor, shown: shown, nextId: nextId,
    firstShown: firstShown, summarize: summarize, encode: encode, decode: decode, strip: strip };
})();
