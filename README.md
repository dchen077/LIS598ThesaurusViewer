# LIS598ThesaurusViewer
**Notes**
<br>The code is written by inputting instructions in generated-AI (including ChatGPT and CoPilot), crossreferencing all tools, and experimenting them in GitHub</br>
**Design Concept Map**
![LIS598(3)](https://github.com/user-attachments/assets/4f31fbcb-fc80-457d-ae63-efcafd953423)
Created in LucidChart

**Log**<br>
*2-19-2025: Hallucinating A Happy Ending*	
1. Attempt Failed: Feeding ChatGPT design doc and asking it create a two panel viewer. 
	a. Partial result. The code displayed two panels. However, it tragically failed to parse the csv file and read any meaningful data. Again, there were two panels though. Also learned how to find errors and "debug" with ChatGPT from console. Switching to CoPilot or DeepSeek did not yield any meaningful result either.
	b. ChatGPT initially gave two solutions, frontend or backened. Do not want to deal with SQL server. That is way beyond my scope and brain power in a couple weeks. 
2. Attempt Failed: Asking ChatGPT to parse the csv file and create a hierarchical list based on the term relationships.
	a. If the code gets too long, ChatGPT only reads the first 1000 or sometimes 2000 characters. Second, screenshoting it the result and telling it what's wrong sometimes or often lead to looping the same mistake as if it ignored my error report.
	b. When ChatGPT says it understands BT and NT after explaining the concept relationships. It doesn't. The code it generate is not correct.

*2-23-2025: Baby Android Steps: Successful End Node Only Hierarchical List for Now*<br>
Main goal: How to correctly parse the csv.file and indicate the relationships between the terms. Correctly display a hierarchical list first.<br>
1. Feeding ChatGPT the basic javascript code for a tree view from https://www.w3schools.com/howto/howto_js_treeview.asp
2. Asking ChatGPT to create a csv.file based on this basic javascript. The csv.file is end node only but one step at a time.
3. Asking ChatGPT to create a javascript that can parse similar structured csv.file and create a tree view based on that. Verify the code by testing it myself, feeding it to new ChatGPT conversation and feeding it to CoPilot (CoPilot said ChatGPT did a "pretty nifty job.")
4. Simplify the csv file to only include hierarchical concepts. Temporarilly omits related terms and use for.  
5. Conclusion: Forget about explaining what BT and NT are. Speak the language of the AI.

*3-9-2025*<br>
1. Currently every cells needed to be filled out to correctly display a hierarchical list. Empty cells are displayed as N/A and seemed to cause issue.
2. Then, I asked ChatGPT to recognize every term before the end node as the broader term of that end node.
3. Broader terms are easily displayed because data is populated in the same row. However, narrower terms provded to be an issue. 
