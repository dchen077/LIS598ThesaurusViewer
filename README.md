# LIS598ThesaurusViewer
The goal of my LIS598 Project was to experiment whether I can build an interface with extremely limited knowledge of javascript and html using generative AI. The short answer is yes. In Project Documentation folder,
I documented my journey of how I realized the Thesaurus Viewer from the design concep map to a working interface.<br>

## Diagrams
**Design Concept Map**
![LIS598 - Page 1(1)](https://github.com/user-attachments/assets/c1e375b6-6193-4016-9ed5-e907a4419a87)
**AI-Integration Flowchart**
![LIS598 - Page 2(3)](https://github.com/user-attachments/assets/e840c717-3fab-4180-9a68-fd7cbd325514)
Created in LucidChart
## Log
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

*3-9-2025: Home Stretch*<br>
1. Currently every cells needed to be filled out to correctly display a hierarchical list. Empty cells are displayed as N/A and seemed to cause issue. For now, I will manually populate each empty cell with the correct term. I asked ChatGPT to create a two panel viewer. On the left side is a hierarchical list, and on the right side there is a details panel. 
2. Then, I asked ChatGPT to recognize every term before the end node as the broader term of that end node.
3. Broader terms are easily displayed because data is populated in the same row. However, narrower terms proved to be an issue. I need to tell ChatGPT exactly how to navigate to the narrower terms of an end node. To do that, I think of how a function logically works. 
4. Narrower terms are displayed correctly. The logic I conveyed to the AI is: "if end node A appears in second to last column in the row for end node B (in other words, the node before the end node), then display end node B as a narrower term for end node A in the detail panel on the right."
5. I asked ChatGPT to add a function to find related terms. Related terms are easy because the corresponding value is on same row. If an end node has multiple related terms, it is separated by semi-colon and space, like this ```; ```
6. Then, I asked ChatGPT to add a function that allow users to navigate to each broader, narrower, and related term in the hierarchy by clicking on them.
7. Fixed comma parse, commas should now be parsed successfully and values should retain now. 
8. USE FOR and Scope Notes can easily be added in the future with the same logic if I just need to add more values to the corresponding end node.
9. I spent sometime playing around with css styling and learning how to configure sprite files. Adding more work but it was rather fun.
10. **Note to self:** reupload the original css styling sheet as the current one is for personal amusement and not very accessible. 
11. Stretch goals: 1) Users can directly upload a csv file instead of hardcoding it in GitHub. 2) Python code that automatically populates the emtpy cells so users don't have to do it themselves. 3) Make it look pretty :)

*Before Submission*<br>
1. Create better documentation that outlines the structure of the csv.file
2. Create AI-integration workflow chart.
3. Accompanied written piece. 
