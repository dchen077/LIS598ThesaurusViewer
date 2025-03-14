# Progress Log
This tells the journey of how I build a working thesaurus viewer without knowing any javascript or html.  
## Step 1: A Hopeful Beginning
### Design Concept Map (Created in LucidChart)
![LIS598 - Page 1(1)](https://github.com/user-attachments/assets/c1e375b6-6193-4016-9ed5-e907a4419a87)
First, I began with a design doc after consulting with my professor Ben Lee :tada:. I wanted to create a two panel viewer where I feed my script a csv file and it will display a hierarchical list on the left and a details panel with broader terms, narrower terms, and related terms on the right. The hierarchical list can collapse and fold. When I click on a term in the broader or narrower term in the details panel, it will direct me to that term in the hierarchical list. 

The csv file part was inspired by my interaction with PoolParty, which is a commercial thesaurus/taxonomy tool I have used in LIS537. After my group built a thesaurus in PoolParty, I can export an excel file that contains all the information (See design doc). My viewer was inspired by how a thesaurus viewer typically looks like (See design doc) with a hierarchica list on the left and details of a term on the right. 

In other words, the goal is not to reimagine the structure of a thesaurus but to create a simple tool that anyone can use (if they have a csv file) and display the thesaurus in a fun and interesting way witout having to find commercial tools or figuring out how to use SQL server with many of the open source tools.

## Step 2: A (Seemingly) Sisyphean Task
Here is an unnecessarily detailed log (mostly failures) of creating the thesaurus viewer and inputting directions in ChatGPT. Feel free to jump ahead to seciton 3. 

*2-19-2025: Hallucinating A Happy Ending*	
1. Attempt Failed: Feeding ChatGPT design doc and asking it create a two panel viewer. 
	a. Partial result. The code displayed two panels. However, it tragically failed to parse the csv file and read any meaningful data. Again, there were two panels though. I learned how to find errors and "debug" with ChatGPT from console. Switching to CoPilot or DeepSeek did not yield any meaningful result either. However, learning how to open and interact with the inspect element tool did not actually help me debug the code. 
	b. ChatGPT initially gave two solutions to my design doc, frontend or backened. I did NOT want to deal with SQL server. That is way beyond my scope and brain power in a couple weeks. 
2. Attempt Failed: Asking ChatGPT to parse the csv file and create a hierarchical list based on the term relationships.
	a. I tried to feed ChatGPT a large dataset with broader terms, narrower terms, related terms, and many relationships. In hindsight, it was a bad idea. If the code gets too long, ChatGPT only read the first 1000 or sometimes 2000 characters. Second, screenshoting it the result and telling it what's wrong sometimes or often lead to looping the same mistake as if it ignored my error report. I often had to refresh my page or start a new conversation because it took too long to respond or made no change to the script. 
	b. Trying to explain what broader terms and narrower terms are to ChatGPT was futile. When ChatGPT said it understood, the generated code still did not not reflect what it claimed to understand. I was not sure how to solve this. 

*2-23-2025: Baby Android Steps*<br>

Today, I decided to go back one step and just focus on parsing the csv file to create a hierarchical list. If I need to adjust my design doc to reflect that, I will.

Good Attempt?

1. I noticed before that the generated script often uses the term tree function. So I decided to google it and found out that tree view is a fundamental concept in frontend development. I then proceeded to feed ChatGPT the correct javascript code for a tree view from a w3schools [tutorial](https://www.w3schools.com/howto/howto_js_treeview.asp).
2. I then asked ChatGPT to create a simple csv.file based on this correct javascript. The csv.file it generated was end node only but *one step at a time*. By end node only, I meant one row has a correct hierarchical list, but if I were to add additional details, I could only ad it to the last term/end node. 
3. Next, I asked ChatGPT to create a javascript that can parse similar structured csv.file and create a tree view based on that. I verified the script by testing it myself, feeding it to new ChatGPT conversations and feeding it to CoPilot (CoPilot said ChatGPT did a "pretty nifty job.")
4. I then simplified my large datasets to only include hierarchical concepts. I temporarilly omitted related terms and use for. *One step at a time.* 

*Floating Failed Attempts Logs With No Dates*
1. The script only parsed the first row of the csv file or from my view only showed the correct information for the first row.
2. When I clicked on the hierarchical list, it showed nothing. How was I suppose to describe the error when nothing shows up even when the generated code has a show error line written in?
3. Why did the broader term for another term not show up? Why did it show up for the wrong term? Why did the same term repeat itself five times in one wrong? Why?
4. Many many more. At this time, I should ask ChatGPT to summarize its errors for me. 

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

## Step 3: Summary
### AI-Integration Flowchart (Created in LucidChart)
![LIS598 - Page 2(3)](https://github.com/user-attachments/assets/e840c717-3fab-4180-9a68-fd7cbd325514)


## Appendix: Tools Used
* ChatGPT (primary tool)
* CoPilot (to verify ChatGPT sometimes)
* DeepSeek (though only once)
* VisualStudio and its HTML11 Extension (for testing). 
* GitHub and GitHub Desktop (for deploying the website)
* Itch.io (for finding game assets to put in styling sheet)
* LucidChart (for designing and creating flowcharts)
