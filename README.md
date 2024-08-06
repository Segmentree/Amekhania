![Logo](https://github.com/Segmentree/Amekhania/blob/feature/readme/public/LogoLight.png?raw=true)

An AI planner, for programmers

## Running the project

Clone the project from github at [Github Repo](https://github.com/Segmentree/Amekhania)

```bash
git clone https://github.com/Segmentree/Amekhania.git
cd Amekhania
```

### Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

## Description

When having a chat with any of the recent AI models, there are normally a couple of things missing, that would make the results of the conversation a lot more use full

### Notes

Weather you are getting ideas for your next project, planning a trip or clearing up ab obscure topic with the help of AI, you do not want to go through the whole conversation to get to it's useful information

That is why at any point in your talks with Amekhania you can ask her to save a note, albeit one that you provide, or one of her precious messages. She will also create any relevant tags for your note

You can ask for recipe suggestions for dinner for the whole week.
Then save each dish as a note that would automatically have a `Recipe` tag
Then gather all necessary ingredients on a `Groceries` note
And Add a reminder to buy the groceries later

After you have created so many Notes that you have no idea how to find the one you want
You can also use AI to filter through them

![AI Search](https://github.com/Segmentree/Amekhania/blob/feature/readme/public/searchGif.gif?raw=true)

### Reminders

After agreeing with chatgpt on a plan, a date, a specific action that they recommend you to do, wouldn't it be great if he could create a reminder for you?

You could have chatgpt create the perfect schedule for your vacations and then save all necessary reminders, like buying the plan tickets, preparing for your trip, making restaurant reservations.....

You Reminders will be Listed on The Reminders Tab:

![Reminders](https://github.com/Segmentree/Amekhania/blob/feature/readme/public/reminders.png?raw=true)

## Tools Lab

And here is the reason why this planner will be specially useful for programmers
You get to code your own tools!

This can be your playground to build any tool you might think would be useful to you

Do you want access to the weather in different cities so that the ai can take into account to plan your day accordingly?
You can easily build a tool to connect to a public weather api

Do you want amekhania yo send a message to someone with their generated text?
You just have to connect to a chat service in a very simple tool

Would you like to write down your emails with the help of amekhania and then sending them right from the chat?
You can build a tool for that

As a plus, this is all saved on your browser's storage, so you would not be sending your code, or your credentials to any external server

## Coming Soon

- Reminders Calendar
- Reminders Email Notifications
- Notes Tabs
