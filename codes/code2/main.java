import java.util.*;
      
      public class Main {
      
      public static void main(String[] args) {
          Scanner scn = new Scanner(System.in);
      
           // write ur code here
           
           int n=scn.nextInt();
           int st = 1;
           int sp = n/2;
           for(int i=1;i<=n;i++){
               if(i<=n/2){
                   for(int j=1;j<=n;j++){
                       if((i==j || i+j==n+1) && i<=n/2){
                           System.out.print("*\t");
                       }
                       else if(i==1){
                           System.out.print("*\t");
                           
                       }
                      
                       else{
                           System.out.print("\t");
                        
                       }
                      
                   }
               }
               else if(i>n/2){
                   for(int j=1;j<=sp;j++){
                           System.out.print("\t");
                       
                   }
                   for(int j=1;j<=st;j++){
                           System.out.print("*\t");
                       
                   }
                    st+=2;
                    sp--;
               }
              
                   
                       System.out.println();
                       
           }
          

       }
      }