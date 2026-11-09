# Original model notices

The unchanged source.nlogox retains the complete original Procedures, Widgets and Info, including all notices. The following is the full original Info text.

## WHAT IS IT?

You are a contestant on a game show.  You, of all people, have made it to the final round, where you have the chance to win some fabulous prize --- a car, a million dollars, eternal youth, etc...  The host or hostess of the game show takes you up on stage, where you stand before three doors, marked "0", "1", and "2".

"Your prize is behind one of these three doors.  Behind the other two are goats, and you don't want these goats.  So, which one will you pick?" she or he says.  You make your selection, and reach for the door -- but before you open it, the hostess or host says to you: "All right, now I'm going to give you a choice."  She or he opens another one of the doors, one you didn't pick.  And sure enough, there's an ugly old goat.

The hostess or host then points to the other door, saying: "If you want, you can change your mind, and pick the last door; the door you didn't pick that I didn't open.  So now, which will it be?  Your first selection?  Or the other door?"  You think for a brief moment...

Which will it be?  Will you stick with your first choice, or switch to the other door?  Does it matter?  Do you have better odds of winning the prize by switching or sticking?  Or is it even odds either way?  (We're assuming here that you want the prize and have an aversion to goats.  If you really would prefer the goat, then the prize is the goat, and the two other doors are empty, or contain mulch, whatever...)

This is a classic puzzle in thinking about probability.  It has several other names: the 'Monty Hall' puzzle (named after the host of the game show this is taken from: "Let's Make a Deal") and 'Goats-and-Car' being the two most common.  The puzzle is based around the questions being asked above, which really boil down to one question at the heart of the matter: which is it better to do, stick or switch?

## HOW IT WORKS

An arbitrary number of turtles (around several hundred, usually) gather together at the bottom of the world.  They then begin to play this three-doors game over and over again.  The prize they can win is a turtle-command: `fd 1`.  If they lose, nothing happens.  Thus, the turtles are having a race to the top of the world, and they can only advance in the race if they win a prize.

Turtles determine the results of each round of the contest by themselves, alternately acting as contestant and host or hostess.  Also, each turtle has a 'hunch' - a percentage chance that it will switch to the other door.  The value of 'hunch' determines a turtle's color.  A turtle that always sticks with its original choice of doors has a hunch of 0 and is colored white.  A turtle that always switches its choice of doors has a hunch of 100 and is colored black.

## HOW TO USE IT

Before you begin playing with the model, read the paragraphs above.  Ask yourself what *you* would do --- stick with your initial pick, or switch to the other door.  Why?  Try to come up with an argument for your decision.  And then, think about the alternative.  Suppose you think it's 'better' to switch.  Why do you think so?  How much better do you think it is?  Why might it be better to stick with your initial decision?  Think about those questions, and talk about them with some of your peers (explain the scenario if they haven't already heard it).

This model is quite easy to run.  First, select the number of turtles you want to be present with the NUMBER slider.  (The more, the better, but you don't want to sacrifice too much speed.)  When you are ready to begin, press the SETUP button.  This will spread turtles randomly across the bottom row of patches.

Make a prediction as to how the different colors of turtles will perform in their race.  The turtles will repeatedly play the three-doors game, until one turtle has made it to the top of the world.  Finally, when you are all set, press the GO button.

If the GRADATION? switch is on, each turtle will be assigned a random "hunch" *between* 0 and 100 (instead of exactly 0 or 100).  Turtles who tend to "stick" will have a lower hunch and be lighter. Turtles who tend to "switch" will have a larger hunch and be darker.

## THINGS TO NOTICE

The main point of this model is demonstrated by the results of the turtles' race.  Try to understand these results.  Run the model a second time, with the same value for NUMBER and see what happens.  Do you accept these results?  In light of what you have observed, ask yourself the above questions again.  Is it better for a turtle to 'play its hunch'?

Try running the model with many more turtles, or just a few turtles.  How does the number of turtles relate to the behavior?

In the first paragraph of HOW TO USE IT above, it asks you to discuss this puzzle with some of your peers.  Important 'things to notice' are their own arguments one way or another.  How vehement were their beliefs?  How sound were their arguments?  How did you react to what they said, and how did they react to the results of this project?

The host or hostess will always open a door that contains a goat --- we're assuming that he or she has perfect information about the location of the prize.  Of what importance is this to the model?  How would the model be different if she or he opened a random door instead of a goat-door?

## THINGS TO TRY

Turn the GRADATION? switch on. How does the pattern of turtles change?

Look at the code for this model, especially if you disagree with its results.  Try to step through the procedure `make-choices`.  Do you think this procedure, and the model as a whole, is fair?

Next, try writing your own procedure for one round of the three-doors contest.  Compare its performance with what you've seen here.

Find someone who hasn't yet seen this model, or thought about this problem before.  Ask them for their opinion, and listen to their argument in defense of their choice.  Try not to argue with them (yet), just hear them out.  Then have them run this model, and see what they think.  If you've looked at the code, try to explain to them what is really going on.

## EXTENDING THE MODEL

This model has been kept very simple for a good reason --- to allow you to expand upon it at your leisure.  There are several directions in which it could go.  First of all, as mentioned above, try writing a different set of procedures for running a round of the contest.

Change the number of doors from three to four, or five, or n (where n could be a slider value).  How will this change the model?  You also might consider having several doors lead to prizes.

If there are n doors, and m different kinds of prizes, as suggested above, you could assign different values to the different prizes.  Maybe create different breeds of turtles, each of which has a different set of prize values?

Regardless of what you do, always make sure to make a prediction about what you think will happen, and to compare the actual results with what you see.

Try inventing a way to display how well each rule does, on average.  You could use monitors or plots.

Create a plot of the effectiveness of the different strategies and setups of the problem described above.

## NETLOGO FEATURES

As the turtles are all competing with one another, it's important that they all take the same amount of time to 'do a round'.  If you have many turtles, it's possible that some turtles could cheat, and get ahead of the others, just by getting through the code quicker.  Thus, we make use of an `ask turtles` block in the `go` procedure.  Whenever you use `ask`, all the agents must finish the block of commands before any agents will continue.  This makes sure that all turtles have caught up to the end of the block.

Note that it does no harm to have a turtle determine the prize door itself --- it does not use this knowledge when deciding which door to pick.

## HOW TO CITE

If you mention this model or the NetLogo software in a publication, we ask that you include the citations below.

For the model itself:

* Wilensky, U. (1998).  NetLogo Three Doors model.  http://ccl.northwestern.edu/netlogo/models/ThreeDoors.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

Please cite the NetLogo software as:

* Wilensky, U. (1999). NetLogo. http://ccl.northwestern.edu/netlogo/. Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

## COPYRIGHT AND LICENSE

Copyright 1998 Uri Wilensky.

![CC BY-NC-SA 3.0](http://ccl.northwestern.edu/images/creativecommons/byncsa.png)

This model is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 License.  To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to Creative Commons, 559 Nathan Abbott Way, Stanford, California 94305, USA.

NetLogo itself is free software for non-commercial use under the terms of the GNU General Public License ([see full license information here](https://ccl.northwestern.edu/netlogo/docs/copyright.html)).

To inquire about commercial licenses for either NetLogo or specific models from the models library, please contact netlogo-commercial-admin@ccl.northwestern.edu.

This model was created as part of the project: CONNECTED MATHEMATICS: MAKING SENSE OF COMPLEX PHENOMENA THROUGH BUILDING OBJECT-BASED PARALLEL MODELS (OBPML).  The project gratefully acknowledges the support of the National Science Foundation (Applications of Advanced Technologies Program) -- grant numbers RED #9552950 and REC #9632612.

This model was converted to NetLogo as part of the projects: PARTICIPATORY SIMULATIONS: NETWORK-BASED DESIGN FOR SYSTEMS LEARNING IN CLASSROOMS and/or INTEGRATED SIMULATION AND MODELING ENVIRONMENT. The project gratefully acknowledges the support of the National Science Foundation (REPP & ROLE programs) -- grant numbers REC #9814682 and REC-0126227. Converted from StarLogoT to NetLogo, 2001.

<!-- 1998 2001 -->
