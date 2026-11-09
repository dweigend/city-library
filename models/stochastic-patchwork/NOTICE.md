# Original model notices

The unchanged source.nlogox retains the complete original Procedures, Widgets and Info, including all notices. The following is the full original Info text.

## WHAT IS IT?

Stochastic Patchwork is a simple model for thinking about a profound idea in the domain of probability: the relation between, on the one hand, the independent chance of  elements to take on the value of a favored event, and on the other hand, the distribution of means of grouped outcomes, that is 'samples.'  Should the distribution of sample means reflect the independent probability?  If so, why?  In this dynamic model, a histogram representing the accumulating distribution of sample means grows before our eyes.

This model is a part of the ProbLab curriculum.  The ProbLab curriculum is currently under development at the CCL.  For more information about the ProbLab curriculum please refer to http://ccl.northwestern.edu/curriculum/ProbLab/.

## HOW IT WORKS

Squares that participate in the sample are those that are in the block you have set up. For instance, for a block-side of 3 you get a "9-block." At every run through GO, each square in the block "rolls a die" to decide whether it should be green (the favored event) or blue. This "die" works as follows: The square chooses a random number between 0 and 100. Next, the square checks to see whether this number is smaller or larger than the value you set for the "%-target-color" slider. If, for instance, the random number was 75 and the slider value was 85, then the square will become green, but if -- say on the immediately consecutive run through Go -- the random number happened to be 95 (and you have not changed the slider value from 85), then the square will be blue on this run. At every run through Go, the overall value of the population's "green-ness" is calculated as the number of green squares in the block divided by the total number of squares in the block. This calculated value is added to a growing list that thus grows in length from trial to trial. The entire list is plotted as a histogram at each run.

Over many runs, the histogram begins to form a bell-shaped curve with your chosen %-target-color as the mode.

Note that for this model, different possible permutations of a given block that all have the same number of green squares in them are considered the same (compound) 'event' and are thus clumped in the same histogram bar.

Note also the ambiguity of the statistic 'greenness.' If 21/25 squares in a block are green, we can say that the greenness of this sample block is 84%. But we also can say that in this sample block, each square is on average .84 green. That is the sample mean. Now, .84 green possibly does not make much sense here, because each square is either completely green or not green at all. But in terms of prediction, one can speak of being .84 sure that a square in the population is totally green.

## HOW TO USE IT

Buttons:
'Setup' - prepares the size of population according to the block-side slider value.
'Go'  - activates the procedures. It is set to work "forever," that is, repeatedly until you press it again.

Sliders:
'block-side' - the larger the value you set here, the larger the size of your square sample. If the block-side is X, then the block will be of dimensions X^2. For example, a block-side of 3 will give a sample of 9 square squares.
'%-target-color' - Use this slider to control the average probability that each square will be green in each iteration through Go.

Monitors:
'# target color' - shows how many squares in the block are green. (Note that the plot window shows a histogram of the percent of green squares, and not of the number of green squares.)

Set the sliders to the values of your choice, press Setup, and then press Go.

## THINGS TO NOTICE

The larger your block, the more possible sample means there are for samples, so the histogram becomes denser (but check the cases of 0% and 100%). For instance, for a sample of 9 squares (block-side = 3) there are 10 different events: 0 out of 9 are green, 1 out of 9 are green, 2 out of 9 are green, 3/9 are green, 4/9, 5/9, 6/9, 7/9, 8/9, and 9/9. But for a sample of 25 squares (block-side = 5) there are 26 different outcomes: 0/25, 1/25, 2/25...24/25, 25/25. Try running the model under the settings block-side 3 and then 5 to appreciate this difference. Interestingly, if you were working with a line graph and not a histogram, you would never see this difference. To try this, you can edit the plot by selecting it and clicking the EDIT button in the Toolbar. Now change the plot pen's mode from 'Bar' to 'Line,' and run the model again. Another way to notice the difference between small and large samples is to see how many different sample means are accumulating into the list of all sample means. Run the model with a block-side 3 for about 10 seconds, and then, in the command center, write "show %-target-color-list." Notice how there are 9 different outcomes. You can also type in:

    show length remove-duplicates %-target-color-list

This will report the number of different outcomes in the list. Compare this to a sample of block-side 5.

## THINGS TO TRY

OK, so we know that a sample of 9 squares gives 10 different events (see previous section). But what happens if you change the %-target-color value? Surely that should change the number of different possible events! Or does it?... How many samples do we need to take to check our answer? Can we ever be sure of our answer? If you have an opportunity, run this model overnight and track for any changes in the distribution range. Otherwise, you should consult an expert on this issue.

How long does it take for the histogram to start taking its typical bell shape? How is this duration of time related, if at all, to the size of the sample?

How is the shape of the curve related to the %-target-color value? Choose a largish block-side value, then set the %-target-color slider to an extremely high value, such as 98%. Let the model run until it begins to take some distinctive shape. Now, stop the model by pressing the Go button again. Then, without pressing Setup, re-set the %-target-color slider to, say, 70% and let it run again. Repeat this several times for smaller and smaller percentages, ending with another extreme percentage, say 2%. You will have a set of curves. Are they all bell shaped? -- If not, why not?

When the block-side is 3 and we run the model, then pretty soon -- that is, after a few thousand trials -- we have 10 bars. That means we have had each of the 10 possible events at least once. So the distribution of outcomes ranges from 0 to 100. How about the case of block-side 7? Will we get the same distribution range?

Ask a friend to set up the %-target-color value for you without your looking. Now, cover the left-hand side of the NetLogo Window (so that you see only the view). You can also do that by asking your friend to shift the entire NetLogo window to the left so that the left-hand side of the window is hidden off screen.(Or, move the slider out of sight and type in the command center "set %-target-color random 101") Next, run the model. Looking at the flashing colors on the sample block, try to guess the percentage of green. Practice this, then switch roles with your friend. Who is better at this task? Discuss your strategies. (see 'Experts' in the EXTENDING section.)

## EXTENDING THE MODEL

A first jab at programming is to change the two focal colors from green and blue to whatever you like. In the Code tab, find the `set-colors` procedures and replace the existing colors with others. You may wish to consult the NetLogo manual (from the "Help" menu) to find out which colors can be named and which have to be numbered. Also, you can use a combination such as `violet + 3`.

A bigger challenge, that would involve some NetLogo programming, is to find and represent interesting patterns in the data that is currently displayed in the existing plot, COLOR DISTRIBUTION. What other variables could be interesting to monitor? For instance, you can monitor how many trials you have had. For this, you want a monitor that will show the length of the list that keeps all the samples. Also, you can add a monitor that shows the average probability, or the occurrence of a particular value, such as 0%. Create monitors that keep track of the distribution range (maximum - minimum). You could create another plot that graphs the average sample mean as it changes over time. What do you expect that graph would look like --- initially, later? How, if at all, would the shape of that graph be related to the settings of the slider values?

Experts (continued from above section): Try extending the model so as to be able to improve your guesstimation strategies. You can even create interactive procedures that will enable you to track your friend's and your progress. For instance, you could modify the model to assign random values to the %-target-color slider without showing you the value. Perhaps it is worthwhile to find ways to make your "guesstimations" more precise. What could such techniques be? How are they related to what scientists call "doing statistics"? Finally, what can we learn about our perceptual mechanism (the way our eyes and brain work together) from this exercise?

## NETLOGO FEATURES

Look in the code at the procedure `create-block` and the reporter procedure `in-rectangle` immediately below it. Note how adjustments need to be made in order to get the code to produce a block of squares with the `block-side` the user sets. You may wish to familiarize yourself with what might seem at first confusing: Even though the squares create a grid-like structure, this grid is offset from the underlying coordinate system that gives squares their names. This real coordinate system runs through the squares' centers and not along their perimeters. For instance, the location of `patch 0 0` is precisely that --- [0 0] --- because its center, that is, its `pxcor` and `pycor`, is on the origin. But in fact, the patch extends from -0.5 to +0.5 along both the x and the y axes.

## CREDITS AND REFERENCES

This model is a part of the ProbLab curriculum. The ProbLab Curriculum is currently under development at Northwestern's Center for Connected Learning and Computer-Based Modeling. . For more information about the ProbLab Curriculum please refer to http://ccl.northwestern.edu/curriculum/ProbLab/.

## HOW TO CITE

If you mention this model or the NetLogo software in a publication, we ask that you include the citations below.

For the model itself:

* Abrahamson, D. and Wilensky, U. (2004).  NetLogo Stochastic Patchwork model.  http://ccl.northwestern.edu/netlogo/models/StochasticPatchwork.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

Please cite the NetLogo software as:

* Wilensky, U. (1999). NetLogo. http://ccl.northwestern.edu/netlogo/. Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

## COPYRIGHT AND LICENSE

Copyright 2004 Uri Wilensky.

![CC BY-NC-SA 3.0](http://ccl.northwestern.edu/images/creativecommons/byncsa.png)

This model is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 License.  To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to Creative Commons, 559 Nathan Abbott Way, Stanford, California 94305, USA.

NetLogo itself is free software for non-commercial use under the terms of the GNU General Public License ([see full license information here](https://ccl.northwestern.edu/netlogo/docs/copyright.html)).

To inquire about commercial licenses for either NetLogo or specific models from the models library, please contact netlogo-commercial-admin@ccl.northwestern.edu.

This model was created as part of the projects: PARTICIPATORY SIMULATIONS: NETWORK-BASED DESIGN FOR SYSTEMS LEARNING IN CLASSROOMS and/or INTEGRATED SIMULATION AND MODELING ENVIRONMENT. The project gratefully acknowledges the support of the National Science Foundation (REPP & ROLE programs) -- grant numbers REC #9814682 and REC-0126227.

<!-- 2004 Cite: Abrahamson, D. -->
