import prisma from "../lib/prisma.js";

export const createGroup = async(req , res)=>{
    try {
        const userId= req.user.userId;
        const group = await prisma.group.create({
            data: {
              name,
              description,
              createdById: userId,
      
              members: {
                create: {
                  userId,
                },
              },
            },
      
            include: {
              members: true,
            },
          });

          res.status(201).json(group);
      
        
    } catch (error) {
        console.log(error);

    res.status(500).json({
      message: "Failed to create group",
    });
        
    }
}

export const getGroup = async(req,res)=>{
    try {
        const {id} = req.params

        const group = await prisma.group.findUnique({
            where:{id},
            include: {
                members: {
                  include: {
                    user: true,
                  },
                },
        
                expenses: {
                    include: {
                      payer: true,
                      splits: true,
                    },
                  },
                },
              });
        res.json(group);
    } catch (error) {
        console.log(error);

        res.status(500).json({
          message: "Failed to fetch group",
        });
    }

}

export const addMember = async(req,res)=>{
    try {
        const {id} = req.params;
        const {email} = req.body;
        const user = await prisma.user.findUnique({
            where: { email },
          });
        if(!user){
            return res.status(400).json({
                message: "User not found",
            })
        }

        const existingMember = await prisma.groupMember.findFirst({
            where: {
              groupId: id,
              userId: user.id,
            },
          });
      
          if (existingMember) {
            return res.status(400).json({
              message: "User already in group",
            });
          }
          const member = await prisma.groupMember.create({
            data: {
              groupId: id,
              userId: user.id,
            },
          });
      
          res.status(201).json(member);


      
        
    } catch (error) {
        console.log(error);

        res.status(500).json({
          message: "Failed to add member",
        });
        
    }
}
export const getBalances = async (req, res) => {
    try {
      const { id } = req.params;
  
      const expenses = await prisma.expense.findMany({
        where: {
          groupId: id,
        },
  
        include: {
          splits: true,
        },
      });
  
      const balances = {};
  
      for (const expense of expenses) {
        const payer = expense.paidById;
  
        if (!balances[payer]) {
          balances[payer] = 0;
        }
  
        balances[payer] += expense.amount;
  
        for (const split of expense.splits) {
          if (!balances[split.userId]) {
            balances[split.userId] = 0;
          }
  
          balances[split.userId] -= split.amountOwed;
        }
      }
  
      const debtors = [];
      const creditors = [];
  
      for (const userId in balances) {
        const amount = Number(balances[userId].toFixed(2));
  
        if (amount < 0) {
          debtors.push({
            userId,
            amount: Math.abs(amount),
          });
        } else if (amount > 0) {
          creditors.push({
            userId,
            amount,
          });
        }
      }
  
      const settlements = [];
  
      let i = 0;
      let j = 0;
  
      while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];
  
        const settledAmount = Math.min(
          debtor.amount,
          creditor.amount
        );
  
        settlements.push({
          from: debtor.userId,
          to: creditor.userId,
          amount: settledAmount,
        });
  
        debtor.amount -= settledAmount;
        creditor.amount -= settledAmount;
  
        if (debtor.amount === 0) i++;
        if (creditor.amount === 0) j++;
      }
  
      res.json({
        balances,
        settlements,
      });
    } catch (error) {
      console.log(error);
  
      res.status(500).json({
        message: "Failed to calculate balances",
      });
    }
  };

  export const deleteExpense = async (req, res) => {
    try {
      const { id } = req.params;
  
      await prisma.expenseSplit.deleteMany({
        where: {
          expenseId: id,
        },
      });
  
      await prisma.expense.delete({
        where: { id },
      });
  
      res.json({
        message: "Expense deleted",
      });
    } catch (error) {
      console.log(error);
  
      res.status(500).json({
        message: "Failed to delete expense",
      });
    }
  };