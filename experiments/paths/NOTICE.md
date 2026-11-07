# Model provenance and adaptation

This TypeScript model adapts the exact served NetLogo model archived in `original.nlogox`. Its complete Procedures, Info, widgets and notices are retained there. The model adaptation uses City Library public World, Agent, Grid and Random operations; it is headless and separately rendered. NetLogo MT and City Library Mulberry streams differ: no trajectory or statistical equivalence is asserted. Presentation colors and camera handling are adapted. Model equations, activation phases, parameter timing and boundaries follow the original.

The original `min-one-of routes-that-take-me-closer [ distance self ]` evaluates zero for every patch candidate. This implementation preserves its random tie across all qualifying visible route patches, rather than substituting the intended nearest-walker route. This source bug was confirmed in actual NetLogo Web Chromium by the coordinator; no nearest-route claim is made.

## HOW TO CITE

If you mention this model or the NetLogo software in a publication, we ask that you include the citations below.

For the model itself:

* Grider, R. and Wilensky, U. (2015).  NetLogo Paths model.  http://ccl.northwestern.edu/netlogo/models/Paths.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

Please cite the NetLogo software as:

* Wilensky, U. (1999). NetLogo. http://ccl.northwestern.edu/netlogo/. Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

## COPYRIGHT AND LICENSE

Copyright 2015 Uri Wilensky.

![CC BY-NC-SA 3.0](http://ccl.northwestern.edu/images/creativecommons/byncsa.png)

This model is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 3.0 License.  To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to Creative Commons, 559 Nathan Abbott Way, Stanford, California 94305, USA.

NetLogo itself is free software for non-commercial use under the terms of the GNU General Public License ([see full license information here](https://ccl.northwestern.edu/netlogo/docs/copyright.html)).

To inquire about commercial licenses for either NetLogo or specific models from the models library, please contact netlogo-commercial-admin@ccl.northwestern.edu.

<!-- 2015 Cite: Grider, R. -->
