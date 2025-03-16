option=$1

if [ "$option" == "transcript" ]; then
    prefix="tn*"
else
    prefix="ai*"
fi

echo "============================================"
echo " Creating Gist with all files matching $prefix."
echo "============================================\n\n"

# Count the number of matching files
file_count=$(ls result/$prefix 2>/dev/null | wc -l)

# Stop script if no files match
if [ "$file_count" -eq 0 ]; then
    echo "No files matching result/$prefix\n\nBye 👋"
    exit 1
fi

gh gist create result/$prefix

# Define the directory name with the current timestamp
DIR_NAME="result/old/$(date +%d%m%Y_%H%M%S)"

# Create the directory
mkdir -p "$DIR_NAME"

echo "\n"
echo "====================================================="
echo " Moving uploaded files to $DIR_NAME"
echo "=====================================================\n\n"

mv result/$prefix "$DIR_NAME"

echo "DONE!"
