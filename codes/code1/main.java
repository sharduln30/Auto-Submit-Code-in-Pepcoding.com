import java.util.*;
      
      public class Main{
      
      public static void main(String[] args) {
          Scanner scn = new Scanner(System.in);
      
           // write ur code here
           int n = scn.nextInt();
           
           for(int i=1;i<=n;i++){
               for(int j=1;j<=n;j++){
                   if(i==(n+1)/2 || j==(n+1)/2){
                       System.out.print("*\t");
                   }
                   else if(j<=n/2 && i==1){
                       System.out.print("*\t");
                       
                   }
                   else if(j>(n+1)/2 && i==n){
                       System.out.print("*\t");
                       
                   }
                   else if(i<=n/2 && j==n){
                       System.out.print("*\t");
                       
                   }
                   else if(i>(n+1)/2 && j==1){
                       System.out.print("*\t");
                       
                   }
                   else{ 
                       System.out.print("\t");
                   }
               }
                       System.out.println();
           }
      
       }
      }