# AppleScript folder action for the pdfmatch command
#
# Open with script editor, compile and save to
# ~/Library/Workflows/Applications/Folder\ Actions/
#
# Then open the "Folder Actions Setup" application and add the work folder
# where your pdfmatch.json config lives and attach this script.
#
on adding folder items to this_folder after receiving these_files
	try
		repeat with each_file in these_files
			tell application "System Events"
				if name extension of each_file is "pdf" or "tif" or "tiff" or "jpeg" or "jpg" then
					# You might need to add your node binary to your $PATH. For example:
					# export PATH=/usr/local/bin:/usr/local/opt/node@6/bin:$PATH 
					set output to (do shell script "cd '" & POSIX path of this_folder & "' && pdfmatch '" & POSIX path of each_file & "' --delete 2>&1")
					#display alert output
				end if
			end tell
		end repeat
	on error err_string number error_number
		display alert "Error " & error_number & ": " & err_string
	end try
end adding folder items to
