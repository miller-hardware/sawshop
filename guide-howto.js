// Saw Shop staff Guide, as short "How do I..." answers. Searchable from the Guide and from the top search box.
// Each answer: g = group, t = title, k = extra words people might type (trimmer = weedeater...), s = steps, tip = optional note.
// To add one, copy a block and keep the steps short. Use the button names exactly as they appear on screen.
var GUIDE_HOWTO=[
// ---------- Getting started ----------
{g:'Getting started',t:'Sign in',k:'log in login password code pin first time',s:[
 'Open the app on the shop tablet, the counter PC or your phone.',
 'Type your first name and your code, then tap Sign In.',
 'First time? Pick the store you work at. The app remembers it on every device after that.'],
 tip:'The app remembers you on that device, so you usually only sign in once.'},
{g:'Getting started',t:'Sign out of a shared tablet or PC',k:'log out logout leave switch user',s:[
 'Go to the Settings tab.','Tap Sign Out.'],tip:'Sign out on a shared tablet when you step away, so your name isn’t on someone else’s work.'},
{g:'Getting started',t:'What each tab is for',k:'tabs menu screens where navigation',s:[
 'Shop Load: every open job, grouped by technician. This opens first.',
 'Web Requests: repair, parts and trade-in requests sent from the website.',
 'Customers: find or add a customer and see their history.',
 '📞 Pickup & Report: who’s ready to be called and who’s been waiting.',
 'Reminders: customers due for seasonal service.',
 '🔧 Parts to Order: parts to order, grouped by vendor.',
 'Work Order Archive: every job, past and present.',
 '🚚 Rental: rental units, reservations, check out and check in.',
 'Settings: your account, vendors, backups and installing the app.']},
{g:'Getting started',t:'Put the app on my phone’s home screen',k:'install icon iphone android app shortcut',s:[
 'iPhone: open the app in Safari, tap the Share icon (square with an up arrow), then Add to Home Screen, then Add.',
 'Android: in Chrome, tap the ⋮ menu, then Install app or Add to Home Screen.',
 'Or open Settings in the app. The install box there walks you through it.']},
{g:'Getting started',t:'A good daily routine',k:'morning start of day routine checklist rhythm',s:[
 'Start on Shop Load and look for red day tags (jobs sitting too long).',
 'Check 🌐 Web Requests for anything new from the website.',
 'Open 📞 Pickup & Report and call who’s ready or waiting on an answer.',
 'Glance at Reminders. A couple of texts each morning keeps work coming in.']},

// ---------- Taking in a job ----------
{g:'Taking in a job',t:'Take in a repair (new work order)',k:'intake drop off check in new job create work order wo customer brought',s:[
 'Tap + New Work Order (red button, or + on a phone).',
 'Customer: search their name or phone. New customer? Tap + New and add them.',
 'Equipment: pick the type, then fill in Brand, Model Number and Serial Number. These three are required.',
 'Tap ❓ Ask the intake questions and go through them with the customer (optional, but it saves the tech time).',
 'Ask: “Can we go ahead with repairs up to $___ without calling you?” Enter it in Customer Approved Repairs Up To $.',
 'Write the hang tag number on a paper tag, enter it in Hang Tag #, and hang the tag on the unit.',
 'Add photos of the serial plate and any damage.',
 'Tap Save Work Order, then Print Work Order. The customer gets the Counter Copy; the tech sheet stays with the unit.']},
{g:'Taking in a job',t:'Use the intake questions',k:'questions question tree questionnaire walk through diagnose ask customer what wrong',s:[
 'On the work order, pick the equipment type first.',
 'Tap ❓ Ask the intake questions above Customer Complaint.',
 'Tap the answer that fits. Not sure is fine, and you can type something else on any question.',
 'Questions marked Check it yourself are quick hands-on checks, like pulling the rope gently.',
 'At the end, read the sentence and tap Put it on the work order. It goes into Customer Complaint for the tech.'],
 tip:'Record what you see and what the customer says. Don’t guess at what’s broken; that’s the tech’s call. Skip the questions if you already know exactly what’s needed.'},
{g:'Taking in a job',t:'The serial plate is missing or I can’t read it',k:'serial number unreadable worn no plate missing required cant save',s:[
 'Check No serial plate / can’t read it under Serial Number.',
 'Take a photo of where the plate should be, so the tech can try.',
 'The job saves and shows “No plate / unreadable”.'],
 tip:'Please don’t type xxx or 000 to get past it. That’s worse than leaving it blank.'},
{g:'Taking in a job',t:'It won’t let me save the work order',k:'cant save required missing brand model serial error red',s:[
 'Look for the red message above the buttons. It says what’s missing.',
 'New repairs need Brand, Model Number and Serial Number.',
 'No serial plate? Check the box under Serial Number.',
 'Quick jobs don’t need these three.']},
{g:'Taking in a job',t:'Take in a quick job (sharpening, trimmer head)',k:'quick lane sharpen chain blade sharpening trimmer weedeater weed eater string head line fast small 30 minutes',s:[
 'Start a new work order and pick the customer.',
 'Check ⚡ Quick job. Use it for anything about 30 minutes or less.',
 'Brand, model and serial aren’t required for quick jobs.',
 'If you use the intake questions, “Sharpen chain only” checks Quick job for you.'],
 tip:'A quick job keeps its place in line; the ⚡ label just helps techs spot it.'},
{g:'Taking in a job',t:'Add photos or a PDF',k:'photo picture camera attach attachment pdf file scan image upload',s:[
 'On a new work order: under Photos & Attachments, tap 📷 Take photo or 📎 Choose photos or files. They upload when you save.',
 'On an existing job: open it and use the same two buttons in the Attachments section.',
 'You can pick several at once. PDFs work too, like a quote or a signed form.'],
 tip:'Each one is labeled with who added it and what stage the job was in, so photos tell the story of the repair.'},
{g:'Taking in a job',t:'Turn a website request into a work order',k:'web request website online request start convert',s:[
 'Open 🌐 Web Requests.',
 'Tap Start work order on the request.',
 'If the customer answered the questions online, tap ❓ Ask the intake questions. Their answers are already filled in, marked Customer said this online.',
 'Confirm them with the customer, do the hands-on checks, and save as usual.']},
{g:'Taking in a job',t:'Pick an estimated completion date',k:'est completion due date when ready promise estimate',s:[
 'Est. Completion suggests a date based on how busy the shop is.',
 'Tap Use to take it, or set your own date.'],
 tip:'It’s an estimate. Tell customers “we’ll call you when it’s ready.”'},
{g:'Taking in a job',t:'Get the customer’s drop-off signature',k:'sign signature authorize drop off',s:[
 'Open the job.',
 'Tap Capture on “Drop-off — Authorizes Diagnosis”.',
 'Have the customer sign with a finger and save.']},
{g:'Taking in a job',t:'Mark a job urgent',k:'rush priority urgent hurry asap top',s:[
 'Open the job and tap Edit.',
 'Check Mark as Priority / Urgent and save. It pins to the top of the lists.']},

// ---------- Working a repair ----------
{g:'Working a repair',t:'Change a job’s status',k:'status stage move update in repair diagnosing waiting ready',s:[
 'Open the job and tap the status button you need.',
 'The order is Intake → Diagnosing → Waiting on Customer → In Repair → Waiting on Parts → Ready → Picked Up.',
 'Use Waiting on Customer when you need their OK. Those jobs show on Pickup & Report so someone calls.']},
{g:'Working a repair',t:'What the red day tag means',k:'red day tag 3d days in stage late overdue too long',s:[
 'The tag (like “3d in stage”) shows how long a job has sat in its current status.',
 'It turns red when it’s been there too long. Work red jobs first.']},
{g:'Working a repair',t:'Use Quick Diagnosis',k:'diagnosis diagnose carburetor carb fuel tune up findings',s:[
 'Open the job and tap what you found (Carburetor, Fuel system, Tune-up and so on).',
 'It fills in the note and the usual parts, with part numbers from past jobs on the same model.',
 'Edit anything, check Order it for parts you need to order, then tap Add to Work Order.']},
{g:'Working a repair',t:'Add parts and labor to a job',k:'part parts labor add line item',s:[
 'Open the job.',
 'Type the part number and description, then tap + Add Part.',
 'If it needs ordering, check Needs to be ordered first. It also shows up in 🔧 Parts to Order.']},
{g:'Working a repair',t:'Find a part number',k:'part number lookup diagram partstree google which part',s:[
 'Open the job and tap 🔎 Parts Diagrams (PartsTree) for that model’s diagrams.',
 'Or tap one of the “Parts used on this model before” buttons.',
 'Still stuck? Tap 🔎 Search Google.']},
{g:'Working a repair',t:'Add a note to a job',k:'note notes comment write talk voice microphone',s:[
 'Open the job.',
 'Type the note and tap + Add Note.',
 'Hands greasy? Tap 🎤 and just talk.']},
{g:'Working a repair',t:'Edit a work order',k:'edit change fix mistake wrong update details',s:[
 'Open the job and tap Edit.',
 'Change what you need and tap Save.'],tip:'Older jobs saved before brand, model and serial were required can still be edited and saved.'},
{g:'Working a repair',t:'Print a work order',k:'print paper copy tech sheet counter copy qr',s:[
 'Open the job and tap Print Work Order.',
 'The top Counter Copy is the customer’s claim ticket; the tech sheet stays with the unit.'],
 tip:'The QR code on the printout opens that job on any phone.'},

// ---------- Parts ----------
{g:'Parts',t:'Order parts',k:'order parts vendor stihl purchase buy',s:[
 'Open 🔧 Parts to Order. Parts are grouped by vendor.',
 'Pick the vendor from the dropdown on each part, place the order, and tap Order on each part you ordered.',
 'Tap \u2713 Mark Ordered \u2014 Close This List and enter the Expected arrival date.'],
 tip:'The expected date shows on the job and on Pickup & Report, and turns LATE if parts don’t show up on time.'},
{g:'Parts',t:'Mark a part received',k:'received arrived came in parts in check in part',s:[
 'Open 🔧 Parts to Order.',
 'Find the part and tap Received. It changes to \u2713 In.',
 'Whole order came in? Tap Select All \u2192 Received on that list.']},
{g:'Parts',t:'Add a vendor',k:'vendor supplier new vendor add',s:[
 'Add one right in 🔧 Parts to Order, or in Settings.',
 'Vendors then show in the dropdown on each part.']},

// ---------- Customers and calls ----------
{g:'Customers and calls',t:'Find a customer, job, serial or part fast',k:'search find look up lookup omni anything phone number',s:[
 'Type in the search box at the top of any screen (on a PC, press / to jump there).',
 'Try a name, the last 4 of a phone number, a WO#, hang tag, serial or part number.',
 'Tap a result to open it, or use the arrow keys and Enter.'],
 tip:'Type “how” plus what you want to do to search this Guide from the same box, like “how order parts”.'},
{g:'Customers and calls',t:'Add a new customer',k:'new customer add create',s:[
 'Go to Customers and tap + Add Customer, or tap + New next to the customer box while making a work order.',
 'Enter their name and phone number, then save.']},
{g:'Customers and calls',t:'Text a customer',k:'text sms message update ready notify tell let know done finished call',s:[
 'Open the job and tap 📱 Text Customer.',
 'Pick ready-for-pickup or a general update. It opens a pre-filled text.'],
 tip:'The text includes a Track My Repair link so they can check status without calling.'},
{g:'Customers and calls',t:'Log a call or contact',k:'call phone log contact voicemail called',s:[
 'Open the job and tap + Log Contact.',
 'Note when you called or texted and what was said.'],tip:'Logging it keeps everyone on the same page, so two people don’t call the same customer.'},
{g:'Customers and calls',t:'Who needs a call today',k:'call list pickup report waiting who to call',s:[
 'Open 📞 Pickup & Report.',
 'Call the ones that are ready, waiting on an answer, or have no contact logged.']},
{g:'Customers and calls',t:'Send seasonal service reminders',k:'reminder reminders tune up season spring text bring in work',s:[
 'Open Reminders. It lists customers due for service.',
 'Tap 📣 Text Reminder on each one, or + Work Order if they’re bringing it in.']},
{g:'Customers and calls',t:'How a customer checks their repair status',k:'track my repair status lookup customer check online',s:[
 'Every text from the app includes a Track My Repair link.',
 'The printed Counter Copy has a QR code they can scan.',
 'They can also look it up on the website.']},

// ---------- Finishing up ----------
{g:'Finishing up',t:'Finish a repair and get it picked up',k:'done finished complete ready pickup picked up close out',s:[
 'Set the status to Ready.',
 'Tap 📱 Text Customer to let them know.',
 'When they come in, tap Capture on “Pickup — Received Equipment” and have them sign.',
 'Print or tap ⬇ Download Invoice if they want a receipt.',
 'Set the status to Picked Up. It moves out of the active lists.']},
{g:'Finishing up',t:'Find an old or finished job',k:'old past history archive picked up finished last year',s:[
 'Type the customer, WO# or serial in the search box at the top.',
 'Or open Work Order Archive to browse every job.']},

// ---------- Rentals and used equipment ----------
{g:'Rentals and used equipment',t:'Add a rental unit',k:'rental fleet new unit add rental',s:[
 'Open 🚚 Rental.',
 'Tap + Add Rental Unit and fill it in.']},
{g:'Rentals and used equipment',t:'Reserve, check out or check in a rental',k:'rent reserve reservation book check out check in return calendar',s:[
 'Open 🚚 Rental and find the unit.',
 'Tap + Reserve to book it, Check Out when it leaves, Check In when it comes back.',
 'Tap 📅 Calendar to see bookings, or ⬇ Invoice for the paperwork.']},
{g:'Rentals and used equipment',t:'Post a used or trade-in unit to the website',k:'used equipment trade in sell sale resale website listing post put mower saw unit for sale',s:[
 'On the work order, check 🏷 Shop-owned used unit (trade-in or resale).',
 'Once it’s marked Ready, a Post to website button shows up on the job.',
 'Pick which photos to show. Only the photos you pick go on the website.']},

// ---------- Settings and safety ----------
{g:'Settings and safety',t:'Delete something',k:'delete remove erase undo warning job work order customer part',s:[
 'Anything that deletes or can’t be undone shows a big red warning first.',
 'Read it before tapping the red button. Cancel keeps everything as it was.'],tip:'Not sure? Ask Mike before deleting.'},
{g:'Settings and safety',t:'Make a backup of the shop’s data',k:'backup back up export save download json copy',s:[
 'Go to Settings, then Export & Backup.',
 'Tap Full Backup (JSON) to save a copy.']}
];
