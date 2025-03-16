option=$1

if [ "$option" == "summary" ]; then
    prefix="ai*"
else
    prefix="tn*"
fi

# Count the number of matching files
file_count=$(ls result/$prefix 2>/dev/null | wc -l)

# Stop script if no files match
if [ "$file_count" -eq 0 ]; then
    echo "No files matching result/$prefix\n\nBye 👋"
    exit 1
fi

# Define the directory name with the current timestamp
FILE_NAME="result/txt/$(date +%d%m%Y_%H%M%S).txt"

# Ensure the output directory exists
mkdir -p result/txt

# Loop through all matching files and append with separator
for file in result/$prefix*; do
  if [[ -f "$file" ]]; then
    printf "\n\n\n=================\n$(basename "$file")\n=================\n\n" >> "$FILE_NAME"
    cat "$file" >> "$FILE_NAME"
  fi
done

# Enable deletion
if [[ "$2" == "mv" ]]; then
    # Define the directory name with the current timestamp
    TRASH_DIR="result/old/$(date +%d%m%Y_%H%M%S)"

    # Create the directory if it doesn't exist
    mkdir -p "$TRASH_DIR"

    # Move the files matching the prefix
    mv result/$prefix* "$TRASH_DIR"
fi

echo "\n==========================================================================="
echo " Created TXT with all files matching $prefix at $FILE_NAME"
echo "===========================================================================\n\n"