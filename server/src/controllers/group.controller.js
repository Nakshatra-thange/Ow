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