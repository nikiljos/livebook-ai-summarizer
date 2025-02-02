echo "======================================="
echo "Creating Gist with all generated files."
echo "=======================================\n\n"

gh gist create result/ai*

# Define the directory name with the current timestamp
DIR_NAME="result/old/$(date +%d%m%Y_%H%M%S)"

# Create the directory
mkdir -p "$DIR_NAME"

echo "\n"
echo "==================================================="
echo "Moving uploaded files to $DIR_NAME"
echo "===================================================\n\n"

mv result/ai* "$DIR_NAME"

echo "DONE!"
