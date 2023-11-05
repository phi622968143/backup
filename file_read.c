#include <stdio.h>
int main() {
  FILE *fptr;
  char word[100];
  // Create a file on your computer (filename.txt)
  fptr = fopen("filename.txt", "w");
  fprintf(fptr, "hello world");
  // Close the file
  fclose(fptr);
  fptr = fopen("filename.txt", "r");
  fgets(word,100,fptr);
  printf("%s",word);
  fclose(fptr);

  return 0;
}