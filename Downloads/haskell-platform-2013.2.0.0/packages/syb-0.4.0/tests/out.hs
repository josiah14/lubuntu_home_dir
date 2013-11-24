[1 of 1] Compiling CompanyDatatypes ( CompanyDatatypes.hs, CompanyDatatypes.o )

==================== Tidy Core ====================
Result size of Tidy Core
  = {terms: 4,139, types: 6,499, coercions: 296}

a_r3dn :: [GHC.Types.Char]
[GblId, Str=DmdType]
a_r3dn = GHC.CString.unpackCString# "CompanyDatatypes.Company"

CompanyDatatypes.$fDataCompany3 :: GHC.Types.Char
[GblId,
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.$fDataCompany3 = GHC.Types.C# 'C'

CompanyDatatypes.$fDataCompany_w1 :: GHC.Base.String
[GblId,
 Caf=NoCafRefs,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.$fDataCompany_w1 =
  GHC.Types.:
    @ GHC.Types.Char
    CompanyDatatypes.$fDataCompany3
    (GHC.Types.[] @ GHC.Types.Char)

lvl_r3do
  :: Data.Data.Constr
     -> GHC.Types.Int -> GHC.Types.Int -> GHC.Types.Int
[GblId, Arity=3, Caf=NoCafRefs]
lvl_r3do =
  \ (x_a17I :: Data.Data.Constr)
    (y_a17J :: GHC.Types.Int)
    (r_a17K :: GHC.Types.Int) ->
    case x_a17I
    of _
    { Data.Data.Constr ds2_a17P ds3_a17Q ds4_a17R ds5_a17S ds6_a17T ->
    case GHC.Base.eqString ds3_a17Q CompanyDatatypes.$fDataCompany_w1
    of _ {
      GHC.Types.False -> r_a17K;
      GHC.Types.True -> y_a17J
    }
    }

Rec {
CompanyDatatypes.$fDataCompany4 :: Data.Data.ConstrRep
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.$fDataCompany4 =
  Data.Data.AlgConstr CompanyDatatypes.$fDataCompany5

CompanyDatatypes.$cC :: Data.Data.Constr
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 60}]
CompanyDatatypes.$cC =
  Data.Data.Constr
    CompanyDatatypes.$fDataCompany4
    CompanyDatatypes.$fDataCompany_w1
    (GHC.Types.[] @ GHC.Base.String)
    Data.Data.Prefix
    CompanyDatatypes.$tCompany

a1_r3dp :: [Data.Data.Constr]
[GblId, Str=DmdType]
a1_r3dp =
  GHC.Types.:
    @ Data.Data.Constr
    CompanyDatatypes.$cC
    (GHC.Types.[] @ Data.Data.Constr)

a2_r3dq :: Data.Data.DataRep
[GblId, Str=DmdType]
a2_r3dq = Data.Data.AlgRep a1_r3dp

CompanyDatatypes.$tCompany [Occ=LoopBreaker] :: Data.Data.DataType
[GblId, Str=DmdType m]
CompanyDatatypes.$tCompany = Data.Data.DataType a_r3dn a2_r3dq

CompanyDatatypes.$fDataCompany5 [Occ=LoopBreaker] :: GHC.Types.Int
[GblId, Str=DmdType]
CompanyDatatypes.$fDataCompany5 =
  GHC.List.foldr2
    @ Data.Data.Constr
    @ GHC.Types.Int
    @ GHC.Types.Int
    lvl_r3do
    (GHC.List.badHead @ GHC.Types.Int)
    a1_r3dp
    Data.Data.mkConstr1
end Rec }

a3_r3dr :: [GHC.Types.Char]
[GblId, Str=DmdType]
a3_r3dr = GHC.CString.unpackCString# "CompanyDatatypes.Dept"

CompanyDatatypes.$fDataDept2 :: GHC.Types.Char
[GblId,
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.$fDataDept2 = GHC.Types.C# 'D'

CompanyDatatypes.$fDataDept_w1 :: GHC.Base.String
[GblId,
 Caf=NoCafRefs,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.$fDataDept_w1 =
  GHC.Types.:
    @ GHC.Types.Char
    CompanyDatatypes.$fDataDept2
    (GHC.Types.[] @ GHC.Types.Char)

lvl1_r3ds
  :: Data.Data.Constr
     -> GHC.Types.Int -> GHC.Types.Int -> GHC.Types.Int
[GblId, Arity=3, Caf=NoCafRefs]
lvl1_r3ds =
  \ (x_a17I :: Data.Data.Constr)
    (y_a17J :: GHC.Types.Int)
    (r_a17K :: GHC.Types.Int) ->
    case x_a17I
    of _
    { Data.Data.Constr ds2_a17P ds3_a17Q ds4_a17R ds5_a17S ds6_a17T ->
    case GHC.Base.eqString ds3_a17Q CompanyDatatypes.$fDataDept_w1
    of _ {
      GHC.Types.False -> r_a17K;
      GHC.Types.True -> y_a17J
    }
    }

Rec {
CompanyDatatypes.$fDataDept3 :: Data.Data.ConstrRep
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.$fDataDept3 =
  Data.Data.AlgConstr CompanyDatatypes.$fDataDept4

CompanyDatatypes.$cD :: Data.Data.Constr
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 60}]
CompanyDatatypes.$cD =
  Data.Data.Constr
    CompanyDatatypes.$fDataDept3
    CompanyDatatypes.$fDataDept_w1
    (GHC.Types.[] @ GHC.Base.String)
    Data.Data.Prefix
    CompanyDatatypes.$tDept

a4_r3dt :: [Data.Data.Constr]
[GblId, Str=DmdType]
a4_r3dt =
  GHC.Types.:
    @ Data.Data.Constr
    CompanyDatatypes.$cD
    (GHC.Types.[] @ Data.Data.Constr)

a5_r3du :: Data.Data.DataRep
[GblId, Str=DmdType]
a5_r3du = Data.Data.AlgRep a4_r3dt

CompanyDatatypes.$tDept [Occ=LoopBreaker] :: Data.Data.DataType
[GblId, Str=DmdType m]
CompanyDatatypes.$tDept = Data.Data.DataType a3_r3dr a5_r3du

CompanyDatatypes.$fDataDept4 [Occ=LoopBreaker] :: GHC.Types.Int
[GblId, Str=DmdType]
CompanyDatatypes.$fDataDept4 =
  GHC.List.foldr2
    @ Data.Data.Constr
    @ GHC.Types.Int
    @ GHC.Types.Int
    lvl1_r3ds
    (GHC.List.badHead @ GHC.Types.Int)
    a4_r3dt
    Data.Data.mkConstr1
end Rec }

a6_r3dv :: [GHC.Types.Char]
[GblId, Str=DmdType]
a6_r3dv = GHC.CString.unpackCString# "CompanyDatatypes.Unit"

w1_r3dw :: GHC.Base.String
[GblId, Str=DmdType]
w1_r3dw = GHC.CString.unpackCString# "PU"

w2_r3dx :: GHC.Base.String
[GblId, Str=DmdType]
w2_r3dx = GHC.CString.unpackCString# "DU"

lvl2_r3dy
  :: Data.Data.Constr
     -> GHC.Types.Int -> GHC.Types.Int -> GHC.Types.Int
[GblId, Arity=3]
lvl2_r3dy =
  \ (x_a17I :: Data.Data.Constr)
    (y_a17J :: GHC.Types.Int)
    (r_a17K :: GHC.Types.Int) ->
    case x_a17I
    of _
    { Data.Data.Constr ds2_a17P ds3_a17Q ds4_a17R ds5_a17S ds6_a17T ->
    case GHC.Base.eqString ds3_a17Q w2_r3dx of _ {
      GHC.Types.False -> r_a17K;
      GHC.Types.True -> y_a17J
    }
    }

lvl3_r3dz
  :: Data.Data.Constr
     -> GHC.Types.Int -> GHC.Types.Int -> GHC.Types.Int
[GblId, Arity=3]
lvl3_r3dz =
  \ (x_a17I :: Data.Data.Constr)
    (y_a17J :: GHC.Types.Int)
    (r_a17K :: GHC.Types.Int) ->
    case x_a17I
    of _
    { Data.Data.Constr ds2_a17P ds3_a17Q ds4_a17R ds5_a17S ds6_a17T ->
    case GHC.Base.eqString ds3_a17Q w1_r3dw of _ {
      GHC.Types.False -> r_a17K;
      GHC.Types.True -> y_a17J
    }
    }

Rec {
a7_r3dA :: Data.Data.ConstrRep
[GblId, Str=DmdType]
a7_r3dA = Data.Data.AlgConstr a12_r3dG

a8_r3dB :: Data.Data.ConstrRep
[GblId, Str=DmdType]
a8_r3dB = Data.Data.AlgConstr a11_r3dF

CompanyDatatypes.$cDU [Occ=LoopBreaker] :: Data.Data.Constr
[GblId, Str=DmdType m]
CompanyDatatypes.$cDU =
  Data.Data.Constr
    a8_r3dB
    w2_r3dx
    (GHC.Types.[] @ GHC.Base.String)
    Data.Data.Prefix
    CompanyDatatypes.$tUnit

lvl4_r3dC :: [Data.Data.Constr]
[GblId, Str=DmdType]
lvl4_r3dC =
  GHC.Types.:
    @ Data.Data.Constr
    CompanyDatatypes.$cDU
    (GHC.Types.[] @ Data.Data.Constr)

CompanyDatatypes.$cPU [Occ=LoopBreaker] :: Data.Data.Constr
[GblId, Str=DmdType m]
CompanyDatatypes.$cPU =
  Data.Data.Constr
    a7_r3dA
    w1_r3dw
    (GHC.Types.[] @ GHC.Base.String)
    Data.Data.Prefix
    CompanyDatatypes.$tUnit

a9_r3dD :: [Data.Data.Constr]
[GblId, Str=DmdType]
a9_r3dD =
  GHC.Types.: @ Data.Data.Constr CompanyDatatypes.$cPU lvl4_r3dC

a10_r3dE :: Data.Data.DataRep
[GblId, Str=DmdType]
a10_r3dE = Data.Data.AlgRep a9_r3dD

CompanyDatatypes.$tUnit [Occ=LoopBreaker] :: Data.Data.DataType
[GblId, Str=DmdType m]
CompanyDatatypes.$tUnit = Data.Data.DataType a6_r3dv a10_r3dE

a11_r3dF :: GHC.Types.Int
[GblId, Str=DmdType]
a11_r3dF =
  GHC.List.foldr2
    @ Data.Data.Constr
    @ GHC.Types.Int
    @ GHC.Types.Int
    lvl2_r3dy
    (GHC.List.badHead @ GHC.Types.Int)
    a9_r3dD
    Data.Data.mkConstr1

a12_r3dG :: GHC.Types.Int
[GblId, Str=DmdType]
a12_r3dG =
  GHC.List.foldr2
    @ Data.Data.Constr
    @ GHC.Types.Int
    @ GHC.Types.Int
    lvl3_r3dz
    (GHC.List.badHead @ GHC.Types.Int)
    a9_r3dD
    Data.Data.mkConstr1
end Rec }

a13_r3dH :: [GHC.Types.Char]
[GblId, Str=DmdType]
a13_r3dH = GHC.CString.unpackCString# "CompanyDatatypes.Employee"

CompanyDatatypes.$fDataEmployee2 :: GHC.Types.Char
[GblId,
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.$fDataEmployee2 = GHC.Types.C# 'E'

CompanyDatatypes.$fDataEmployee_w1 :: GHC.Base.String
[GblId,
 Caf=NoCafRefs,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.$fDataEmployee_w1 =
  GHC.Types.:
    @ GHC.Types.Char
    CompanyDatatypes.$fDataEmployee2
    (GHC.Types.[] @ GHC.Types.Char)

lvl5_r3dI
  :: Data.Data.Constr
     -> GHC.Types.Int -> GHC.Types.Int -> GHC.Types.Int
[GblId, Arity=3, Caf=NoCafRefs]
lvl5_r3dI =
  \ (x_a17I :: Data.Data.Constr)
    (y_a17J :: GHC.Types.Int)
    (r_a17K :: GHC.Types.Int) ->
    case x_a17I
    of _
    { Data.Data.Constr ds2_a17P ds3_a17Q ds4_a17R ds5_a17S ds6_a17T ->
    case GHC.Base.eqString ds3_a17Q CompanyDatatypes.$fDataEmployee_w1
    of _ {
      GHC.Types.False -> r_a17K;
      GHC.Types.True -> y_a17J
    }
    }

Rec {
CompanyDatatypes.$fDataEmployee3 :: Data.Data.ConstrRep
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.$fDataEmployee3 =
  Data.Data.AlgConstr CompanyDatatypes.$fDataEmployee4

CompanyDatatypes.$cE :: Data.Data.Constr
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 60}]
CompanyDatatypes.$cE =
  Data.Data.Constr
    CompanyDatatypes.$fDataEmployee3
    CompanyDatatypes.$fDataEmployee_w1
    (GHC.Types.[] @ GHC.Base.String)
    Data.Data.Prefix
    CompanyDatatypes.$tEmployee

a14_r3dJ :: [Data.Data.Constr]
[GblId, Str=DmdType]
a14_r3dJ =
  GHC.Types.:
    @ Data.Data.Constr
    CompanyDatatypes.$cE
    (GHC.Types.[] @ Data.Data.Constr)

a15_r3dK :: Data.Data.DataRep
[GblId, Str=DmdType]
a15_r3dK = Data.Data.AlgRep a14_r3dJ

CompanyDatatypes.$tEmployee [Occ=LoopBreaker] :: Data.Data.DataType
[GblId, Str=DmdType m]
CompanyDatatypes.$tEmployee = Data.Data.DataType a13_r3dH a15_r3dK

CompanyDatatypes.$fDataEmployee4 [Occ=LoopBreaker] :: GHC.Types.Int
[GblId, Str=DmdType]
CompanyDatatypes.$fDataEmployee4 =
  GHC.List.foldr2
    @ Data.Data.Constr
    @ GHC.Types.Int
    @ GHC.Types.Int
    lvl5_r3dI
    (GHC.List.badHead @ GHC.Types.Int)
    a14_r3dJ
    Data.Data.mkConstr1
end Rec }

a16_r3dL :: [GHC.Types.Char]
[GblId, Str=DmdType]
a16_r3dL = GHC.CString.unpackCString# "CompanyDatatypes.Person"

CompanyDatatypes.$fDataPerson3 :: GHC.Types.Char
[GblId,
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.$fDataPerson3 = GHC.Types.C# 'P'

CompanyDatatypes.$fDataPerson_w1 :: GHC.Base.String
[GblId,
 Caf=NoCafRefs,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.$fDataPerson_w1 =
  GHC.Types.:
    @ GHC.Types.Char
    CompanyDatatypes.$fDataPerson3
    (GHC.Types.[] @ GHC.Types.Char)

lvl6_r3dM
  :: Data.Data.Constr
     -> GHC.Types.Int -> GHC.Types.Int -> GHC.Types.Int
[GblId, Arity=3, Caf=NoCafRefs]
lvl6_r3dM =
  \ (x_a17I :: Data.Data.Constr)
    (y_a17J :: GHC.Types.Int)
    (r_a17K :: GHC.Types.Int) ->
    case x_a17I
    of _
    { Data.Data.Constr ds2_a17P ds3_a17Q ds4_a17R ds5_a17S ds6_a17T ->
    case GHC.Base.eqString ds3_a17Q CompanyDatatypes.$fDataPerson_w1
    of _ {
      GHC.Types.False -> r_a17K;
      GHC.Types.True -> y_a17J
    }
    }

Rec {
CompanyDatatypes.$fDataPerson4 :: Data.Data.ConstrRep
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.$fDataPerson4 =
  Data.Data.AlgConstr CompanyDatatypes.$fDataPerson5

CompanyDatatypes.$cP :: Data.Data.Constr
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 60}]
CompanyDatatypes.$cP =
  Data.Data.Constr
    CompanyDatatypes.$fDataPerson4
    CompanyDatatypes.$fDataPerson_w1
    (GHC.Types.[] @ GHC.Base.String)
    Data.Data.Prefix
    CompanyDatatypes.$tPerson

a17_r3dN :: [Data.Data.Constr]
[GblId, Str=DmdType]
a17_r3dN =
  GHC.Types.:
    @ Data.Data.Constr
    CompanyDatatypes.$cP
    (GHC.Types.[] @ Data.Data.Constr)

a18_r3dO :: Data.Data.DataRep
[GblId, Str=DmdType]
a18_r3dO = Data.Data.AlgRep a17_r3dN

CompanyDatatypes.$tPerson [Occ=LoopBreaker] :: Data.Data.DataType
[GblId, Str=DmdType m]
CompanyDatatypes.$tPerson = Data.Data.DataType a16_r3dL a18_r3dO

CompanyDatatypes.$fDataPerson5 [Occ=LoopBreaker] :: GHC.Types.Int
[GblId, Str=DmdType]
CompanyDatatypes.$fDataPerson5 =
  GHC.List.foldr2
    @ Data.Data.Constr
    @ GHC.Types.Int
    @ GHC.Types.Int
    lvl6_r3dM
    (GHC.List.badHead @ GHC.Types.Int)
    a17_r3dN
    Data.Data.mkConstr1
end Rec }

a19_r3dP :: [GHC.Types.Char]
[GblId, Str=DmdType]
a19_r3dP = GHC.CString.unpackCString# "CompanyDatatypes.Salary"

CompanyDatatypes.$fDataSalary2 :: GHC.Types.Char
[GblId,
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.$fDataSalary2 = GHC.Types.C# 'S'

CompanyDatatypes.$fDataSalary_w1 :: GHC.Base.String
[GblId,
 Caf=NoCafRefs,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.$fDataSalary_w1 =
  GHC.Types.:
    @ GHC.Types.Char
    CompanyDatatypes.$fDataSalary2
    (GHC.Types.[] @ GHC.Types.Char)

lvl7_r3dQ
  :: Data.Data.Constr
     -> GHC.Types.Int -> GHC.Types.Int -> GHC.Types.Int
[GblId, Arity=3, Caf=NoCafRefs]
lvl7_r3dQ =
  \ (x_a17I :: Data.Data.Constr)
    (y_a17J :: GHC.Types.Int)
    (r_a17K :: GHC.Types.Int) ->
    case x_a17I
    of _
    { Data.Data.Constr ds2_a17P ds3_a17Q ds4_a17R ds5_a17S ds6_a17T ->
    case GHC.Base.eqString ds3_a17Q CompanyDatatypes.$fDataSalary_w1
    of _ {
      GHC.Types.False -> r_a17K;
      GHC.Types.True -> y_a17J
    }
    }

Rec {
CompanyDatatypes.$fDataSalary3 :: Data.Data.ConstrRep
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.$fDataSalary3 =
  Data.Data.AlgConstr CompanyDatatypes.$fDataSalary4

CompanyDatatypes.$cS :: Data.Data.Constr
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 60}]
CompanyDatatypes.$cS =
  Data.Data.Constr
    CompanyDatatypes.$fDataSalary3
    CompanyDatatypes.$fDataSalary_w1
    (GHC.Types.[] @ GHC.Base.String)
    Data.Data.Prefix
    CompanyDatatypes.$tSalary

a20_r3dR :: [Data.Data.Constr]
[GblId, Str=DmdType]
a20_r3dR =
  GHC.Types.:
    @ Data.Data.Constr
    CompanyDatatypes.$cS
    (GHC.Types.[] @ Data.Data.Constr)

a21_r3dS :: Data.Data.DataRep
[GblId, Str=DmdType]
a21_r3dS = Data.Data.AlgRep a20_r3dR

CompanyDatatypes.$tSalary [Occ=LoopBreaker] :: Data.Data.DataType
[GblId, Str=DmdType m]
CompanyDatatypes.$tSalary = Data.Data.DataType a19_r3dP a21_r3dS

CompanyDatatypes.$fDataSalary4 [Occ=LoopBreaker] :: GHC.Types.Int
[GblId, Str=DmdType]
CompanyDatatypes.$fDataSalary4 =
  GHC.List.foldr2
    @ Data.Data.Constr
    @ GHC.Types.Int
    @ GHC.Types.Int
    lvl7_r3dQ
    (GHC.List.badHead @ GHC.Types.Int)
    a20_r3dR
    Data.Data.mkConstr1
end Rec }

CompanyDatatypes.person3 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 40 0}]
CompanyDatatypes.person3 = GHC.CString.unpackCString# "Lazy"

CompanyDatatypes.person2 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 40 0}]
CompanyDatatypes.person2 = GHC.CString.unpackCString# "Home"

CompanyDatatypes.person1 :: CompanyDatatypes.Person
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.person1 =
  CompanyDatatypes.P
    CompanyDatatypes.person3 CompanyDatatypes.person2

CompanyDatatypes.dept3 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 50 0}]
CompanyDatatypes.dept3 = GHC.CString.unpackCString# "Useless"

CompanyDatatypes.dept2 :: CompanyDatatypes.Employee
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.dept2 =
  CompanyDatatypes.E
    CompanyDatatypes.person1
    (GHC.Err.undefined @ CompanyDatatypes.Salary)

CompanyDatatypes.dept1 :: CompanyDatatypes.Dept
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 40}]
CompanyDatatypes.dept1 =
  CompanyDatatypes.D
    CompanyDatatypes.dept3
    CompanyDatatypes.dept2
    (GHC.Types.[] @ CompanyDatatypes.Unit)

CompanyDatatypes.blair5 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 50 0}]
CompanyDatatypes.blair5 = GHC.CString.unpackCString# "Blair"

CompanyDatatypes.blair4 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 50 0}]
CompanyDatatypes.blair4 = GHC.CString.unpackCString# "London"

CompanyDatatypes.blair3 :: CompanyDatatypes.Person
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.blair3 =
  CompanyDatatypes.P CompanyDatatypes.blair5 CompanyDatatypes.blair4

CompanyDatatypes.blair2 :: GHC.Types.Float
[GblId,
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.blair2 = GHC.Types.F# (__float 100000.0)

CompanyDatatypes.blair1 :: CompanyDatatypes.Salary
[GblId,
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.blair1 =
  CompanyDatatypes.S CompanyDatatypes.blair2

CompanyDatatypes.blair :: CompanyDatatypes.Employee
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.blair =
  CompanyDatatypes.E CompanyDatatypes.blair3 CompanyDatatypes.blair1

CompanyDatatypes.marlow5 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 50 0}]
CompanyDatatypes.marlow5 = GHC.CString.unpackCString# "Marlow"

CompanyDatatypes.marlow4 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 60 0}]
CompanyDatatypes.marlow4 = GHC.CString.unpackCString# "Cambridge"

CompanyDatatypes.marlow3 :: CompanyDatatypes.Person
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.marlow3 =
  CompanyDatatypes.P
    CompanyDatatypes.marlow5 CompanyDatatypes.marlow4

CompanyDatatypes.marlow2 :: GHC.Types.Float
[GblId,
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.marlow2 = GHC.Types.F# (__float 2000.0)

CompanyDatatypes.marlow1 :: CompanyDatatypes.Salary
[GblId,
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.marlow1 =
  CompanyDatatypes.S CompanyDatatypes.marlow2

CompanyDatatypes.marlow :: CompanyDatatypes.Employee
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.marlow =
  CompanyDatatypes.E
    CompanyDatatypes.marlow3 CompanyDatatypes.marlow1

CompanyDatatypes.joost5 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 50 0}]
CompanyDatatypes.joost5 = GHC.CString.unpackCString# "Joost"

CompanyDatatypes.joost4 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 60 0}]
CompanyDatatypes.joost4 = GHC.CString.unpackCString# "Amsterdam"

CompanyDatatypes.joost3 :: CompanyDatatypes.Person
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.joost3 =
  CompanyDatatypes.P CompanyDatatypes.joost5 CompanyDatatypes.joost4

CompanyDatatypes.joost2 :: GHC.Types.Float
[GblId,
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.joost2 = GHC.Types.F# (__float 1000.0)

CompanyDatatypes.joost1 :: CompanyDatatypes.Salary
[GblId,
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.joost1 =
  CompanyDatatypes.S CompanyDatatypes.joost2

CompanyDatatypes.joost :: CompanyDatatypes.Employee
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.joost =
  CompanyDatatypes.E CompanyDatatypes.joost3 CompanyDatatypes.joost1

CompanyDatatypes.laemmel4 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 50 0}]
CompanyDatatypes.laemmel4 = GHC.CString.unpackCString# "Laemmel"

CompanyDatatypes.laemmel3 :: CompanyDatatypes.Person
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.laemmel3 =
  CompanyDatatypes.P
    CompanyDatatypes.laemmel4 CompanyDatatypes.joost4

CompanyDatatypes.laemmel2 :: GHC.Types.Float
[GblId,
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.laemmel2 = GHC.Types.F# (__float 8000.0)

CompanyDatatypes.laemmel1 :: CompanyDatatypes.Salary
[GblId,
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.laemmel1 =
  CompanyDatatypes.S CompanyDatatypes.laemmel2

CompanyDatatypes.laemmel :: CompanyDatatypes.Employee
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.laemmel =
  CompanyDatatypes.E
    CompanyDatatypes.laemmel3 CompanyDatatypes.laemmel1

CompanyDatatypes.lammel3 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 50 0}]
CompanyDatatypes.lammel3 = GHC.CString.unpackCString# "Lammel"

CompanyDatatypes.lammel2 :: CompanyDatatypes.Person
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.lammel2 =
  CompanyDatatypes.P CompanyDatatypes.lammel3 CompanyDatatypes.joost4

CompanyDatatypes.lammel1 :: CompanyDatatypes.Salary
[GblId,
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.lammel1 =
  CompanyDatatypes.S CompanyDatatypes.laemmel2

CompanyDatatypes.lammel :: CompanyDatatypes.Employee
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.lammel =
  CompanyDatatypes.E
    CompanyDatatypes.lammel2 CompanyDatatypes.lammel1

CompanyDatatypes.genCom10 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 50 0}]
CompanyDatatypes.genCom10 = GHC.CString.unpackCString# "Research"

CompanyDatatypes.genCom9 :: CompanyDatatypes.Unit
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.genCom9 =
  CompanyDatatypes.PU CompanyDatatypes.joost

CompanyDatatypes.genCom8 :: CompanyDatatypes.Unit
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.genCom8 =
  CompanyDatatypes.PU CompanyDatatypes.marlow

CompanyDatatypes.genCom'6 :: [CompanyDatatypes.Unit]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.genCom'6 =
  GHC.Types.:
    @ CompanyDatatypes.Unit
    CompanyDatatypes.genCom8
    (GHC.Types.[] @ CompanyDatatypes.Unit)

CompanyDatatypes.genCom'5 :: [CompanyDatatypes.Unit]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.genCom'5 =
  GHC.Types.:
    @ CompanyDatatypes.Unit
    CompanyDatatypes.genCom9
    CompanyDatatypes.genCom'6

CompanyDatatypes.genCom'4 :: CompanyDatatypes.Dept
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 40}]
CompanyDatatypes.genCom'4 =
  CompanyDatatypes.D
    CompanyDatatypes.genCom10
    CompanyDatatypes.lammel
    CompanyDatatypes.genCom'5

CompanyDatatypes.genCom4 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 50 0}]
CompanyDatatypes.genCom4 = GHC.CString.unpackCString# "Strategy"

CompanyDatatypes.genCom'3 :: CompanyDatatypes.Dept
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 40}]
CompanyDatatypes.genCom'3 =
  CompanyDatatypes.D
    CompanyDatatypes.genCom4
    CompanyDatatypes.blair
    (GHC.Types.[] @ CompanyDatatypes.Unit)

CompanyDatatypes.genCom'2 :: [CompanyDatatypes.Dept]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.genCom'2 =
  GHC.Types.:
    @ CompanyDatatypes.Dept
    CompanyDatatypes.genCom'3
    (GHC.Types.[] @ CompanyDatatypes.Dept)

CompanyDatatypes.genCom'1 :: [CompanyDatatypes.Dept]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.genCom'1 =
  GHC.Types.:
    @ CompanyDatatypes.Dept
    CompanyDatatypes.genCom'4
    CompanyDatatypes.genCom'2

CompanyDatatypes.genCom' :: CompanyDatatypes.Company
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.genCom' =
  CompanyDatatypes.C CompanyDatatypes.genCom'1

CompanyDatatypes.genCom7 :: [CompanyDatatypes.Unit]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.genCom7 =
  GHC.Types.:
    @ CompanyDatatypes.Unit
    CompanyDatatypes.genCom8
    (GHC.Types.[] @ CompanyDatatypes.Unit)

CompanyDatatypes.genCom6 :: [CompanyDatatypes.Unit]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.genCom6 =
  GHC.Types.:
    @ CompanyDatatypes.Unit
    CompanyDatatypes.genCom9
    CompanyDatatypes.genCom7

CompanyDatatypes.genCom5 :: CompanyDatatypes.Dept
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 40}]
CompanyDatatypes.genCom5 =
  CompanyDatatypes.D
    CompanyDatatypes.genCom10
    CompanyDatatypes.laemmel
    CompanyDatatypes.genCom6

CompanyDatatypes.genCom3 :: CompanyDatatypes.Dept
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 40}]
CompanyDatatypes.genCom3 =
  CompanyDatatypes.D
    CompanyDatatypes.genCom4
    CompanyDatatypes.blair
    (GHC.Types.[] @ CompanyDatatypes.Unit)

CompanyDatatypes.genCom2 :: [CompanyDatatypes.Dept]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.genCom2 =
  GHC.Types.:
    @ CompanyDatatypes.Dept
    CompanyDatatypes.genCom3
    (GHC.Types.[] @ CompanyDatatypes.Dept)

CompanyDatatypes.genCom1 :: [CompanyDatatypes.Dept]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.genCom1 =
  GHC.Types.:
    @ CompanyDatatypes.Dept
    CompanyDatatypes.genCom5
    CompanyDatatypes.genCom2

CompanyDatatypes.genCom :: CompanyDatatypes.Company
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.genCom =
  CompanyDatatypes.C CompanyDatatypes.genCom1

CompanyDatatypes.$fDataCompany_$cdataTypeOf
  :: CompanyDatatypes.Company -> Data.Data.DataType
[GblId,
 Arity=1,
 Str=DmdType Am,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ _ -> CompanyDatatypes.$tCompany}]
CompanyDatatypes.$fDataCompany_$cdataTypeOf =
  \ _ -> CompanyDatatypes.$tCompany

CompanyDatatypes.$fDataCompany_$ctoConstr
  :: CompanyDatatypes.Company -> Data.Data.Constr
[GblId,
 Arity=1,
 Str=DmdType U(A)m,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (ds_d16f [Occ=Once!] :: CompanyDatatypes.Company) ->
                 case ds_d16f of _ { CompanyDatatypes.C _ ->
                 CompanyDatatypes.$cC
                 }}]
CompanyDatatypes.$fDataCompany_$ctoConstr =
  \ (ds_d16f :: CompanyDatatypes.Company) ->
    case ds_d16f of _ { CompanyDatatypes.C ds1_d16g ->
    CompanyDatatypes.$cC
    }

CompanyDatatypes.$fDataDept_$cdataTypeOf
  :: CompanyDatatypes.Dept -> Data.Data.DataType
[GblId,
 Arity=1,
 Str=DmdType Am,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ _ -> CompanyDatatypes.$tDept}]
CompanyDatatypes.$fDataDept_$cdataTypeOf =
  \ _ -> CompanyDatatypes.$tDept

CompanyDatatypes.$fDataDept_$ctoConstr
  :: CompanyDatatypes.Dept -> Data.Data.Constr
[GblId,
 Arity=1,
 Str=DmdType U(AAA)m,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (ds_d160 [Occ=Once!] :: CompanyDatatypes.Dept) ->
                 case ds_d160 of _ { CompanyDatatypes.D _ _ _ ->
                 CompanyDatatypes.$cD
                 }}]
CompanyDatatypes.$fDataDept_$ctoConstr =
  \ (ds_d160 :: CompanyDatatypes.Dept) ->
    case ds_d160
    of _ { CompanyDatatypes.D ds1_d161 ds2_d162 ds3_d163 ->
    CompanyDatatypes.$cD
    }

CompanyDatatypes.$fDataUnit_$cdataTypeOf
  :: CompanyDatatypes.Unit -> Data.Data.DataType
[GblId,
 Arity=1,
 Str=DmdType Am,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ _ -> CompanyDatatypes.$tUnit}]
CompanyDatatypes.$fDataUnit_$cdataTypeOf =
  \ _ -> CompanyDatatypes.$tUnit

CompanyDatatypes.$fDataUnit_$ctoConstr
  :: CompanyDatatypes.Unit -> Data.Data.Constr
[GblId,
 Arity=1,
 Str=DmdType Sm,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (ds_d15L [Occ=Once!] :: CompanyDatatypes.Unit) ->
                 case ds_d15L of _ {
                   CompanyDatatypes.PU _ -> CompanyDatatypes.$cPU;
                   CompanyDatatypes.DU _ -> CompanyDatatypes.$cDU
                 }}]
CompanyDatatypes.$fDataUnit_$ctoConstr =
  \ (ds_d15L :: CompanyDatatypes.Unit) ->
    case ds_d15L of _ {
      CompanyDatatypes.PU ds1_d15N -> CompanyDatatypes.$cPU;
      CompanyDatatypes.DU ds1_d15M -> CompanyDatatypes.$cDU
    }

CompanyDatatypes.$fDataEmployee_$cdataTypeOf
  :: CompanyDatatypes.Employee -> Data.Data.DataType
[GblId,
 Arity=1,
 Str=DmdType Am,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ _ -> CompanyDatatypes.$tEmployee}]
CompanyDatatypes.$fDataEmployee_$cdataTypeOf =
  \ _ -> CompanyDatatypes.$tEmployee

CompanyDatatypes.$fDataEmployee_$ctoConstr
  :: CompanyDatatypes.Employee -> Data.Data.Constr
[GblId,
 Arity=1,
 Str=DmdType U(AA)m,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (ds_d15n [Occ=Once!] :: CompanyDatatypes.Employee) ->
                 case ds_d15n of _ { CompanyDatatypes.E _ _ ->
                 CompanyDatatypes.$cE
                 }}]
CompanyDatatypes.$fDataEmployee_$ctoConstr =
  \ (ds_d15n :: CompanyDatatypes.Employee) ->
    case ds_d15n of _ { CompanyDatatypes.E ds1_d15o ds2_d15p ->
    CompanyDatatypes.$cE
    }

CompanyDatatypes.$fDataPerson_$cdataTypeOf
  :: CompanyDatatypes.Person -> Data.Data.DataType
[GblId,
 Arity=1,
 Str=DmdType Am,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ _ -> CompanyDatatypes.$tPerson}]
CompanyDatatypes.$fDataPerson_$cdataTypeOf =
  \ _ -> CompanyDatatypes.$tPerson

CompanyDatatypes.$fDataPerson_$ctoConstr
  :: CompanyDatatypes.Person -> Data.Data.Constr
[GblId,
 Arity=1,
 Str=DmdType U(AA)m,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (ds_d159 [Occ=Once!] :: CompanyDatatypes.Person) ->
                 case ds_d159 of _ { CompanyDatatypes.P _ _ ->
                 CompanyDatatypes.$cP
                 }}]
CompanyDatatypes.$fDataPerson_$ctoConstr =
  \ (ds_d159 :: CompanyDatatypes.Person) ->
    case ds_d159 of _ { CompanyDatatypes.P ds1_d15a ds2_d15b ->
    CompanyDatatypes.$cP
    }

CompanyDatatypes.$fDataPerson2
  :: [GHC.Types.Char] -> Data.Typeable.Internal.TypeRep
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 30 0}]
CompanyDatatypes.$fDataPerson2 =
  Data.Typeable.Internal.typeOfDefault
    @ []
    @ GHC.Types.Char
    (Data.Typeable.Internal.$fTypeable1[]_$ctypeOf1
     `cast` (Sym <(Data.Typeable.Internal.NTCo:Typeable1 <[]>)>
             :: (forall a_a1GP. [a_a1GP] -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable1 []))
    (Data.Typeable.Internal.$fTypeableChar_$ctypeOf
     `cast` (Sym
               <(Data.Typeable.Internal.NTCo:Typeable <GHC.Types.Char>)>
             :: (GHC.Types.Char -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable GHC.Types.Char))

CompanyDatatypes.$fDataPerson_$dData1
  :: Data.Data.Data CompanyDatatypes.Address
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 30 0}]
CompanyDatatypes.$fDataPerson_$dData1 =
  Data.Data.$fData[]
    @ GHC.Types.Char
    (CompanyDatatypes.$fDataPerson2
     `cast` (Sym
               <(Data.Typeable.Internal.NTCo:Typeable <[GHC.Types.Char]>)>
             :: ([GHC.Types.Char] -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable [GHC.Types.Char]))
    Data.Data.$fDataChar

CompanyDatatypes.$fDataPerson_$cgunfold
  :: forall (c_aV9 :: * -> *).
     (forall b_aVa r_aVb.
      Data.Data.Data b_aVa =>
      c_aV9 (b_aVa -> r_aVb) -> c_aV9 r_aVb)
     -> (forall r_aVc. r_aVc -> c_aV9 r_aVc)
     -> Data.Data.Constr
     -> c_aV9 CompanyDatatypes.Person
[GblId,
 Arity=3,
 Str=DmdType C(C(S))LA,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=3, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (c_t1p :: * -> *))
                 (k_XWB
                    :: forall b_aVa r_aVb.
                       Data.Data.Data b_aVa =>
                       c_t1p (b_aVa -> r_aVb) -> c_t1p r_aVb)
                 (z_XWD [Occ=Once!] :: forall r_aVc. r_aVc -> c_t1p r_aVc)
                 _ ->
                 k_XWB
                   @ CompanyDatatypes.Address
                   @ CompanyDatatypes.Person
                   CompanyDatatypes.$fDataPerson_$dData1
                   (k_XWB
                      @ CompanyDatatypes.Name
                      @ (CompanyDatatypes.Address -> CompanyDatatypes.Person)
                      CompanyDatatypes.$fDataPerson_$dData1
                      (z_XWD
                         @ (CompanyDatatypes.Name
                            -> CompanyDatatypes.Address -> CompanyDatatypes.Person)
                         CompanyDatatypes.P))}]
CompanyDatatypes.$fDataPerson_$cgunfold =
  \ (@ (c_t1p :: * -> *))
    (k_XWB
       :: forall b_aVa r_aVb.
          Data.Data.Data b_aVa =>
          c_t1p (b_aVa -> r_aVb) -> c_t1p r_aVb)
    (z_XWD :: forall r_aVc. r_aVc -> c_t1p r_aVc)
    _ ->
    k_XWB
      @ CompanyDatatypes.Address
      @ CompanyDatatypes.Person
      CompanyDatatypes.$fDataPerson_$dData1
      (k_XWB
         @ CompanyDatatypes.Name
         @ (CompanyDatatypes.Address -> CompanyDatatypes.Person)
         CompanyDatatypes.$fDataPerson_$dData1
         (z_XWD
            @ (CompanyDatatypes.Name
               -> CompanyDatatypes.Address -> CompanyDatatypes.Person)
            CompanyDatatypes.P))

CompanyDatatypes.$fDataPerson_$dData
  :: Data.Data.Data CompanyDatatypes.Address
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 30 0}]
CompanyDatatypes.$fDataPerson_$dData =
  Data.Data.$fData[]
    @ GHC.Types.Char
    (CompanyDatatypes.$fDataPerson2
     `cast` (Sym
               <(Data.Typeable.Internal.NTCo:Typeable <[GHC.Types.Char]>)>
             :: ([GHC.Types.Char] -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable [GHC.Types.Char]))
    Data.Data.$fDataChar

CompanyDatatypes.$w$cgfoldl
  :: forall (c_aV0 :: * -> *).
     (forall d_aV1 b_aV2.
      Data.Data.Data d_aV1 =>
      c_aV0 (d_aV1 -> b_aV2) -> d_aV1 -> c_aV0 b_aV2)
     -> (forall g_aV3. g_aV3 -> c_aV0 g_aV3)
     -> CompanyDatatypes.Name
     -> CompanyDatatypes.Address
     -> c_aV0 CompanyDatatypes.Person
[GblId,
 Arity=4,
 Str=DmdType C(C(C(S)))LLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=4, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [120 60 0 0] 100 0}]
CompanyDatatypes.$w$cgfoldl =
  \ (@ (c_aV0 :: * -> *))
    (w_s2bX
       :: forall d_aV1 b_aV2.
          Data.Data.Data d_aV1 =>
          c_aV0 (d_aV1 -> b_aV2) -> d_aV1 -> c_aV0 b_aV2)
    (w3_s2bY :: forall g_aV3. g_aV3 -> c_aV0 g_aV3)
    (ww_s2c1 :: CompanyDatatypes.Name)
    (ww1_s2c2 :: CompanyDatatypes.Address) ->
    w_s2bX
      @ CompanyDatatypes.Address
      @ CompanyDatatypes.Person
      CompanyDatatypes.$fDataPerson_$dData
      (w_s2bX
         @ CompanyDatatypes.Name
         @ (CompanyDatatypes.Address -> CompanyDatatypes.Person)
         CompanyDatatypes.$fDataPerson_$dData
         (w3_s2bY
            @ (CompanyDatatypes.Name
               -> CompanyDatatypes.Address -> CompanyDatatypes.Person)
            CompanyDatatypes.P)
         ww_s2c1)
      ww1_s2c2

CompanyDatatypes.$fDataPerson_$cgfoldl [InlPrag=INLINE[0]]
  :: forall (c_aV0 :: * -> *).
     (forall d_aV1 b_aV2.
      Data.Data.Data d_aV1 =>
      c_aV0 (d_aV1 -> b_aV2) -> d_aV1 -> c_aV0 b_aV2)
     -> (forall g_aV3. g_aV3 -> c_aV0 g_aV3)
     -> CompanyDatatypes.Person
     -> c_aV0 CompanyDatatypes.Person
[GblId,
 Arity=3,
 Str=DmdType C(C(C(S)))LU(LL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgfoldl, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (c_aV0 :: * -> *))
                 (w_s2bX [Occ=Once]
                    :: forall d_aV1 b_aV2.
                       Data.Data.Data d_aV1 =>
                       c_aV0 (d_aV1 -> b_aV2) -> d_aV1 -> c_aV0 b_aV2)
                 (w3_s2bY [Occ=Once] :: forall g_aV3. g_aV3 -> c_aV0 g_aV3)
                 (w4_s2bZ [Occ=Once!] :: CompanyDatatypes.Person) ->
                 case w4_s2bZ
                 of _ { CompanyDatatypes.P ww_s2c1 [Occ=Once] ww1_s2c2 [Occ=Once] ->
                 CompanyDatatypes.$w$cgfoldl @ c_aV0 w_s2bX w3_s2bY ww_s2c1 ww1_s2c2
                 }}]
CompanyDatatypes.$fDataPerson_$cgfoldl =
  \ (@ (c_aV0 :: * -> *))
    (w_s2bX
       :: forall d_aV1 b_aV2.
          Data.Data.Data d_aV1 =>
          c_aV0 (d_aV1 -> b_aV2) -> d_aV1 -> c_aV0 b_aV2)
    (w3_s2bY :: forall g_aV3. g_aV3 -> c_aV0 g_aV3)
    (w4_s2bZ :: CompanyDatatypes.Person) ->
    case w4_s2bZ of _ { CompanyDatatypes.P ww_s2c1 ww1_s2c2 ->
    CompanyDatatypes.$w$cgfoldl @ c_aV0 w_s2bX w3_s2bY ww_s2c1 ww1_s2c2
    }

CompanyDatatypes.$w$c==2
  :: CompanyDatatypes.Name
     -> CompanyDatatypes.Address
     -> CompanyDatatypes.Name
     -> CompanyDatatypes.Address
     -> GHC.Types.Bool
[GblId,
 Arity=4,
 Caf=NoCafRefs,
 Str=DmdType SLSL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=4, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [0 0 0 0] 80 10}]
CompanyDatatypes.$w$c==2 =
  \ (ww_s2c9 :: CompanyDatatypes.Name)
    (ww1_s2ca :: CompanyDatatypes.Address)
    (ww2_s2ce :: CompanyDatatypes.Name)
    (ww3_s2cf :: CompanyDatatypes.Address) ->
    case GHC.Base.eqString ww_s2c9 ww2_s2ce of _ {
      GHC.Types.False -> GHC.Types.False;
      GHC.Types.True -> GHC.Base.eqString ww1_s2ca ww3_s2cf
    }

CompanyDatatypes.$fEqPerson_$c== [InlPrag=INLINE[0]]
  :: CompanyDatatypes.Person
     -> CompanyDatatypes.Person -> GHC.Types.Bool
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType U(SL)U(SL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$c==2, TopLvl=True, Arity=2,
         Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (w_s2c7 [Occ=Once!] :: CompanyDatatypes.Person)
                 (w3_s2cc [Occ=Once!] :: CompanyDatatypes.Person) ->
                 case w_s2c7
                 of _ { CompanyDatatypes.P ww_s2c9 [Occ=Once] ww1_s2ca [Occ=Once] ->
                 case w3_s2cc
                 of _
                 { CompanyDatatypes.P ww2_s2ce [Occ=Once] ww3_s2cf [Occ=Once] ->
                 CompanyDatatypes.$w$c==2 ww_s2c9 ww1_s2ca ww2_s2ce ww3_s2cf
                 }
                 }}]
CompanyDatatypes.$fEqPerson_$c== =
  \ (w_s2c7 :: CompanyDatatypes.Person)
    (w3_s2cc :: CompanyDatatypes.Person) ->
    case w_s2c7 of _ { CompanyDatatypes.P ww_s2c9 ww1_s2ca ->
    case w3_s2cc of _ { CompanyDatatypes.P ww2_s2ce ww3_s2cf ->
    CompanyDatatypes.$w$c==2 ww_s2c9 ww1_s2ca ww2_s2ce ww3_s2cf
    }
    }

CompanyDatatypes.$w$c/=
  :: CompanyDatatypes.Name
     -> CompanyDatatypes.Address
     -> CompanyDatatypes.Name
     -> CompanyDatatypes.Address
     -> GHC.Types.Bool
[GblId,
 Arity=4,
 Caf=NoCafRefs,
 Str=DmdType SLSL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=4, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [0 0 0 0] 100 30}]
CompanyDatatypes.$w$c/= =
  \ (ww_s2cm :: CompanyDatatypes.Name)
    (ww1_s2cn :: CompanyDatatypes.Address)
    (ww2_s2cr :: CompanyDatatypes.Name)
    (ww3_s2cs :: CompanyDatatypes.Address) ->
    case GHC.Base.eqString ww_s2cm ww2_s2cr of _ {
      GHC.Types.False -> GHC.Types.True;
      GHC.Types.True ->
        case GHC.Base.eqString ww1_s2cn ww3_s2cs of _ {
          GHC.Types.False -> GHC.Types.True;
          GHC.Types.True -> GHC.Types.False
        }
    }

CompanyDatatypes.$fEqPerson_$c/= [InlPrag=INLINE[0]]
  :: CompanyDatatypes.Person
     -> CompanyDatatypes.Person -> GHC.Types.Bool
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType U(SL)U(SL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$c/=, TopLvl=True, Arity=2,
         Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (w_s2ck [Occ=Once!] :: CompanyDatatypes.Person)
                 (w3_s2cp [Occ=Once!] :: CompanyDatatypes.Person) ->
                 case w_s2ck
                 of _ { CompanyDatatypes.P ww_s2cm [Occ=Once] ww1_s2cn [Occ=Once] ->
                 case w3_s2cp
                 of _
                 { CompanyDatatypes.P ww2_s2cr [Occ=Once] ww3_s2cs [Occ=Once] ->
                 CompanyDatatypes.$w$c/= ww_s2cm ww1_s2cn ww2_s2cr ww3_s2cs
                 }
                 }}]
CompanyDatatypes.$fEqPerson_$c/= =
  \ (w_s2ck :: CompanyDatatypes.Person)
    (w3_s2cp :: CompanyDatatypes.Person) ->
    case w_s2ck of _ { CompanyDatatypes.P ww_s2cm ww1_s2cn ->
    case w3_s2cp of _ { CompanyDatatypes.P ww2_s2cr ww3_s2cs ->
    CompanyDatatypes.$w$c/= ww_s2cm ww1_s2cn ww2_s2cr ww3_s2cs
    }
    }

CompanyDatatypes.$fEqPerson [InlPrag=[ALWAYS] CONLIKE]
  :: GHC.Classes.Eq CompanyDatatypes.Person
[GblId[DFunId],
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=DFun(arity=0) GHC.Classes.D:Eq [{CompanyDatatypes.$fEqPerson_$c==},
                                     {CompanyDatatypes.$fEqPerson_$c/=}]]
CompanyDatatypes.$fEqPerson =
  GHC.Classes.D:Eq
    @ CompanyDatatypes.Person
    CompanyDatatypes.$fEqPerson_$c==
    CompanyDatatypes.$fEqPerson_$c/=

CompanyDatatypes.$fDataSalary_$cdataTypeOf
  :: CompanyDatatypes.Salary -> Data.Data.DataType
[GblId,
 Arity=1,
 Str=DmdType Am,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ _ -> CompanyDatatypes.$tSalary}]
CompanyDatatypes.$fDataSalary_$cdataTypeOf =
  \ _ -> CompanyDatatypes.$tSalary

CompanyDatatypes.$fDataSalary_$ctoConstr
  :: CompanyDatatypes.Salary -> Data.Data.Constr
[GblId,
 Arity=1,
 Str=DmdType U(A)m,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (ds_d14W [Occ=Once!] :: CompanyDatatypes.Salary) ->
                 case ds_d14W of _ { CompanyDatatypes.S _ ->
                 CompanyDatatypes.$cS
                 }}]
CompanyDatatypes.$fDataSalary_$ctoConstr =
  \ (ds_d14W :: CompanyDatatypes.Salary) ->
    case ds_d14W of _ { CompanyDatatypes.S ds1_d14X ->
    CompanyDatatypes.$cS
    }

CompanyDatatypes.$fDataSalary_$cgunfold
  :: forall (c_aV9 :: * -> *).
     (forall b_aVa r_aVb.
      Data.Data.Data b_aVa =>
      c_aV9 (b_aVa -> r_aVb) -> c_aV9 r_aVb)
     -> (forall r_aVc. r_aVc -> c_aV9 r_aVc)
     -> Data.Data.Constr
     -> c_aV9 CompanyDatatypes.Salary
[GblId,
 Arity=3,
 Str=DmdType C(C(S))LA,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=3, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (c_tL :: * -> *))
                 (k_aS8 [Occ=Once!]
                    :: forall b_aVa r_aVb.
                       Data.Data.Data b_aVa =>
                       c_tL (b_aVa -> r_aVb) -> c_tL r_aVb)
                 (z_aS9 [Occ=Once!] :: forall r_aVc. r_aVc -> c_tL r_aVc)
                 _ ->
                 k_aS8
                   @ GHC.Types.Float
                   @ CompanyDatatypes.Salary
                   Data.Data.$fDataFloat
                   (z_aS9
                      @ (GHC.Types.Float -> CompanyDatatypes.Salary)
                      CompanyDatatypes.S)}]
CompanyDatatypes.$fDataSalary_$cgunfold =
  \ (@ (c_tL :: * -> *))
    (k_aS8
       :: forall b_aVa r_aVb.
          Data.Data.Data b_aVa =>
          c_tL (b_aVa -> r_aVb) -> c_tL r_aVb)
    (z_aS9 :: forall r_aVc. r_aVc -> c_tL r_aVc)
    _ ->
    k_aS8
      @ GHC.Types.Float
      @ CompanyDatatypes.Salary
      Data.Data.$fDataFloat
      (z_aS9
         @ (GHC.Types.Float -> CompanyDatatypes.Salary) CompanyDatatypes.S)

CompanyDatatypes.$fDataSalary_$cgfoldl
  :: forall (c_aV0 :: * -> *).
     (forall d_aV1 b_aV2.
      Data.Data.Data d_aV1 =>
      c_aV0 (d_aV1 -> b_aV2) -> d_aV1 -> c_aV0 b_aV2)
     -> (forall g_aV3. g_aV3 -> c_aV0 g_aV3)
     -> CompanyDatatypes.Salary
     -> c_aV0 CompanyDatatypes.Salary
[GblId,
 Arity=3,
 Str=DmdType C(C(C(S)))LU(L),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=3, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (c_tH :: * -> *))
                 (k_aS5 [Occ=Once!]
                    :: forall d_aV1 b_aV2.
                       Data.Data.Data d_aV1 =>
                       c_tH (d_aV1 -> b_aV2) -> d_aV1 -> c_tH b_aV2)
                 (z_aS6 [Occ=Once!] :: forall g_aV3. g_aV3 -> c_tH g_aV3)
                 (ds_d14T [Occ=Once!] :: CompanyDatatypes.Salary) ->
                 case ds_d14T of _ { CompanyDatatypes.S a22_aS7 [Occ=Once] ->
                 k_aS5
                   @ GHC.Types.Float
                   @ CompanyDatatypes.Salary
                   Data.Data.$fDataFloat
                   (z_aS6
                      @ (GHC.Types.Float -> CompanyDatatypes.Salary) CompanyDatatypes.S)
                   a22_aS7
                 }}]
CompanyDatatypes.$fDataSalary_$cgfoldl =
  \ (@ (c_tH :: * -> *))
    (k_aS5
       :: forall d_aV1 b_aV2.
          Data.Data.Data d_aV1 =>
          c_tH (d_aV1 -> b_aV2) -> d_aV1 -> c_tH b_aV2)
    (z_aS6 :: forall g_aV3. g_aV3 -> c_tH g_aV3)
    (ds_d14T :: CompanyDatatypes.Salary) ->
    case ds_d14T of _ { CompanyDatatypes.S a22_aS7 ->
    k_aS5
      @ GHC.Types.Float
      @ CompanyDatatypes.Salary
      Data.Data.$fDataFloat
      (z_aS6
         @ (GHC.Types.Float -> CompanyDatatypes.Salary) CompanyDatatypes.S)
      a22_aS7
    }

CompanyDatatypes.$fShowCompany5 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 40 0}]
CompanyDatatypes.$fShowCompany5 = GHC.CString.unpackCString# "P "

CompanyDatatypes.$w$cshowsPrec3
  :: GHC.Prim.Int#
     -> CompanyDatatypes.Name
     -> CompanyDatatypes.Address
     -> GHC.Base.String
     -> GHC.Base.String
[GblId,
 Arity=4,
 Str=DmdType LLLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=4, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [0 0 0 0] 241 30}]
CompanyDatatypes.$w$cshowsPrec3 =
  \ (ww_s2cA :: GHC.Prim.Int#)
    (ww1_s2cE :: CompanyDatatypes.Name)
    (ww2_s2cF :: CompanyDatatypes.Address)
    (w_s2cH :: GHC.Base.String) ->
    let {
      p_a1ck :: GHC.Show.ShowS
      [LclId, Arity=1, Str=DmdType L]
      p_a1ck =
        \ (x_a1cM :: GHC.Base.String) ->
          GHC.Base.++
            @ GHC.Types.Char
            CompanyDatatypes.$fShowCompany5
            (GHC.Types.:
               @ GHC.Types.Char
               GHC.Show.$fShowChar1
               (GHC.Show.showLitString
                  ww1_s2cE
                  (GHC.Types.:
                     @ GHC.Types.Char
                     GHC.Show.$fShowChar1
                     (GHC.Types.:
                        @ GHC.Types.Char
                        GHC.Show.showSpace1
                        (GHC.Types.:
                           @ GHC.Types.Char
                           GHC.Show.$fShowChar1
                           (GHC.Show.showLitString
                              ww2_s2cF
                              (GHC.Types.:
                                 @ GHC.Types.Char GHC.Show.$fShowChar1 x_a1cM))))))) } in
    case GHC.Prim.>=# ww_s2cA 11 of _ {
      GHC.Types.False -> p_a1ck w_s2cH;
      GHC.Types.True ->
        GHC.Types.:
          @ GHC.Types.Char
          GHC.Show.shows11
          (p_a1ck (GHC.Types.: @ GHC.Types.Char GHC.Show.shows10 w_s2cH))
    }

CompanyDatatypes.$fShowPerson_$cshowsPrec [InlPrag=INLINE[0]]
  :: GHC.Types.Int -> CompanyDatatypes.Person -> GHC.Show.ShowS
[GblId,
 Arity=3,
 Str=DmdType U(L)U(LL)L,
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cshowsPrec3, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (w_s2cy [Occ=Once!] :: GHC.Types.Int)
                 (w3_s2cC [Occ=Once!] :: CompanyDatatypes.Person)
                 (w4_s2cH [Occ=Once] :: GHC.Base.String) ->
                 case w_s2cy of _ { GHC.Types.I# ww_s2cA [Occ=Once] ->
                 case w3_s2cC
                 of _
                 { CompanyDatatypes.P ww1_s2cE [Occ=Once] ww2_s2cF [Occ=Once] ->
                 CompanyDatatypes.$w$cshowsPrec3 ww_s2cA ww1_s2cE ww2_s2cF w4_s2cH
                 }
                 }}]
CompanyDatatypes.$fShowPerson_$cshowsPrec =
  \ (w_s2cy :: GHC.Types.Int)
    (w3_s2cC :: CompanyDatatypes.Person)
    (w4_s2cH :: GHC.Base.String) ->
    case w_s2cy of _ { GHC.Types.I# ww_s2cA ->
    case w3_s2cC of _ { CompanyDatatypes.P ww1_s2cE ww2_s2cF ->
    CompanyDatatypes.$w$cshowsPrec3 ww_s2cA ww1_s2cE ww2_s2cF w4_s2cH
    }
    }

CompanyDatatypes.$fShowPerson1
  :: CompanyDatatypes.Person -> GHC.Show.ShowS
[GblId,
 Arity=2,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [20 0] 60 0}]
CompanyDatatypes.$fShowPerson1 =
  \ (w_s2cC :: CompanyDatatypes.Person)
    (w3_s2cH :: GHC.Base.String) ->
    case w_s2cC of _ { CompanyDatatypes.P ww_s2cE ww1_s2cF ->
    CompanyDatatypes.$w$cshowsPrec3 0 ww_s2cE ww1_s2cF w3_s2cH
    }

CompanyDatatypes.$fShowPerson_$cshowList
  :: [CompanyDatatypes.Person] -> GHC.Show.ShowS
[GblId,
 Arity=2,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [] 20 60}]
CompanyDatatypes.$fShowPerson_$cshowList =
  GHC.Show.showList__
    @ CompanyDatatypes.Person CompanyDatatypes.$fShowPerson1

CompanyDatatypes.$fShowPerson_$cshow
  :: CompanyDatatypes.Person -> GHC.Base.String
[GblId,
 Arity=1,
 Str=DmdType U(LL),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (x_a1dj [Occ=Once] :: CompanyDatatypes.Person) ->
                 CompanyDatatypes.$fShowPerson_$cshowsPrec
                   GHC.Show.shows26 x_a1dj (GHC.Types.[] @ GHC.Types.Char)}]
CompanyDatatypes.$fShowPerson_$cshow =
  \ (x_a1dj :: CompanyDatatypes.Person) ->
    case x_a1dj of _ { CompanyDatatypes.P ww_s2cE ww1_s2cF ->
    CompanyDatatypes.$w$cshowsPrec3
      0 ww_s2cE ww1_s2cF (GHC.Types.[] @ GHC.Types.Char)
    }

CompanyDatatypes.$fShowPerson [InlPrag=[ALWAYS] CONLIKE]
  :: GHC.Show.Show CompanyDatatypes.Person
[GblId[DFunId],
 Str=DmdType m,
 Unf=DFun(arity=0) GHC.Show.D:Show [{CompanyDatatypes.$fShowPerson_$cshowsPrec},
                                    {CompanyDatatypes.$fShowPerson_$cshow},
                                    {CompanyDatatypes.$fShowPerson_$cshowList}]]
CompanyDatatypes.$fShowPerson =
  GHC.Show.D:Show
    @ CompanyDatatypes.Person
    CompanyDatatypes.$fShowPerson_$cshowsPrec
    CompanyDatatypes.$fShowPerson_$cshow
    CompanyDatatypes.$fShowPerson_$cshowList

CompanyDatatypes.$fShowCompany7 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 40 0}]
CompanyDatatypes.$fShowCompany7 = GHC.CString.unpackCString# "S "

CompanyDatatypes.$fShowCompany8 :: GHC.Types.Int
[GblId,
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 20}]
CompanyDatatypes.$fShowCompany8 = GHC.Types.I# 11

CompanyDatatypes.$w$cshowsPrec4
  :: GHC.Prim.Int# -> GHC.Types.Float -> GHC.Show.ShowS
[GblId,
 Arity=2,
 Str=DmdType LL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [0 20] 221 120}]
CompanyDatatypes.$w$cshowsPrec4 =
  \ (ww_s2cN :: GHC.Prim.Int#) (ww1_s2cR :: GHC.Types.Float) ->
    let {
      g_a1cL [Dmd=Just L] :: GHC.Base.String -> GHC.Base.String
      [LclId, Str=DmdType]
      g_a1cL =
        case ww1_s2cR of _ { GHC.Types.F# ww2_a25X ->
        GHC.Float.$w$sshowSignedFloat1
          GHC.Float.$fShowFloat_$sshowFloat
          CompanyDatatypes.$fShowCompany8
          ww2_a25X
        } } in
    case GHC.Prim.>=# ww_s2cN 11 of _ {
      GHC.Types.False ->
        \ (x_a1cM :: GHC.Base.String) ->
          GHC.Base.++
            @ GHC.Types.Char CompanyDatatypes.$fShowCompany7 (g_a1cL x_a1cM);
      GHC.Types.True ->
        \ (x_a1cp :: GHC.Base.String) ->
          GHC.Types.:
            @ GHC.Types.Char
            GHC.Show.shows11
            (GHC.Base.++
               @ GHC.Types.Char
               CompanyDatatypes.$fShowCompany7
               (g_a1cL (GHC.Types.: @ GHC.Types.Char GHC.Show.shows10 x_a1cp)))
    }

CompanyDatatypes.$fShowSalary_$cshowsPrec [InlPrag=INLINE[0]]
  :: GHC.Types.Int -> CompanyDatatypes.Salary -> GHC.Show.ShowS
[GblId,
 Arity=2,
 Str=DmdType U(L)U(L),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cshowsPrec4, TopLvl=True,
         Arity=2, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (w_s2cL [Occ=Once!] :: GHC.Types.Int)
                 (w3_s2cP [Occ=Once!] :: CompanyDatatypes.Salary) ->
                 case w_s2cL of _ { GHC.Types.I# ww_s2cN [Occ=Once] ->
                 case w3_s2cP of _ { CompanyDatatypes.S ww1_s2cR [Occ=Once] ->
                 CompanyDatatypes.$w$cshowsPrec4 ww_s2cN ww1_s2cR
                 }
                 }}]
CompanyDatatypes.$fShowSalary_$cshowsPrec =
  \ (w_s2cL :: GHC.Types.Int) (w3_s2cP :: CompanyDatatypes.Salary) ->
    case w_s2cL of _ { GHC.Types.I# ww_s2cN ->
    case w3_s2cP of _ { CompanyDatatypes.S ww1_s2cR ->
    CompanyDatatypes.$w$cshowsPrec4 ww_s2cN ww1_s2cR
    }
    }

CompanyDatatypes.$fShowSalary1
  :: CompanyDatatypes.Salary -> GHC.Show.ShowS
[GblId,
 Arity=1,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [20] 40 0}]
CompanyDatatypes.$fShowSalary1 =
  \ (w_s2cP :: CompanyDatatypes.Salary) ->
    case w_s2cP of _ { CompanyDatatypes.S ww_s2cR ->
    CompanyDatatypes.$w$cshowsPrec4 0 ww_s2cR
    }

CompanyDatatypes.$fShowSalary_$cshowList
  :: [CompanyDatatypes.Salary] -> GHC.Show.ShowS
[GblId,
 Arity=2,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [] 20 60}]
CompanyDatatypes.$fShowSalary_$cshowList =
  GHC.Show.showList__
    @ CompanyDatatypes.Salary CompanyDatatypes.$fShowSalary1

CompanyDatatypes.$fShowSalary_$cshow
  :: CompanyDatatypes.Salary -> GHC.Base.String
[GblId,
 Arity=1,
 Str=DmdType U(L),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (x_a1dj [Occ=Once] :: CompanyDatatypes.Salary) ->
                 CompanyDatatypes.$fShowSalary_$cshowsPrec
                   GHC.Show.shows26 x_a1dj (GHC.Types.[] @ GHC.Types.Char)}]
CompanyDatatypes.$fShowSalary_$cshow =
  \ (x_a1dj :: CompanyDatatypes.Salary) ->
    case x_a1dj of _ { CompanyDatatypes.S ww_s2cR ->
    CompanyDatatypes.$w$cshowsPrec4
      0 ww_s2cR (GHC.Types.[] @ GHC.Types.Char)
    }

CompanyDatatypes.$fShowSalary [InlPrag=[ALWAYS] CONLIKE]
  :: GHC.Show.Show CompanyDatatypes.Salary
[GblId[DFunId],
 Str=DmdType m,
 Unf=DFun(arity=0) GHC.Show.D:Show [{CompanyDatatypes.$fShowSalary_$cshowsPrec},
                                    {CompanyDatatypes.$fShowSalary_$cshow},
                                    {CompanyDatatypes.$fShowSalary_$cshowList}]]
CompanyDatatypes.$fShowSalary =
  GHC.Show.D:Show
    @ CompanyDatatypes.Salary
    CompanyDatatypes.$fShowSalary_$cshowsPrec
    CompanyDatatypes.$fShowSalary_$cshow
    CompanyDatatypes.$fShowSalary_$cshowList

CompanyDatatypes.$fShowCompany6 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 40 0}]
CompanyDatatypes.$fShowCompany6 = GHC.CString.unpackCString# "E "

CompanyDatatypes.$w$cshowsPrec2
  :: GHC.Prim.Int#
     -> CompanyDatatypes.Person
     -> CompanyDatatypes.Salary
     -> GHC.Show.ShowS
[GblId,
 Arity=3,
 Str=DmdType LLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=3, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [0 20 20] 261 120}]
CompanyDatatypes.$w$cshowsPrec2 =
  \ (ww_s2cY :: GHC.Prim.Int#)
    (ww1_s2d2 :: CompanyDatatypes.Person)
    (ww2_s2d3 :: CompanyDatatypes.Salary) ->
    let {
      g_X1m6 [Dmd=Just L] :: GHC.Base.String -> GHC.Base.String
      [LclId, Str=DmdType]
      g_X1m6 =
        case ww2_s2d3 of _ { CompanyDatatypes.S ww3_s2cR ->
        CompanyDatatypes.$w$cshowsPrec4 11 ww3_s2cR
        } } in
    let {
      p_a1ck :: GHC.Show.ShowS
      [LclId, Arity=1, Str=DmdType L]
      p_a1ck =
        \ (x_X1mc :: GHC.Base.String) ->
          GHC.Base.++
            @ GHC.Types.Char
            CompanyDatatypes.$fShowCompany6
            (case ww1_s2d2 of _ { CompanyDatatypes.P ww3_s2cE ww4_s2cF ->
             CompanyDatatypes.$w$cshowsPrec3
               11
               ww3_s2cE
               ww4_s2cF
               (GHC.Types.: @ GHC.Types.Char GHC.Show.showSpace1 (g_X1m6 x_X1mc))
             }) } in
    case GHC.Prim.>=# ww_s2cY 11 of _ {
      GHC.Types.False -> p_a1ck;
      GHC.Types.True ->
        \ (x_a1cp :: GHC.Base.String) ->
          GHC.Types.:
            @ GHC.Types.Char
            GHC.Show.shows11
            (p_a1ck (GHC.Types.: @ GHC.Types.Char GHC.Show.shows10 x_a1cp))
    }

CompanyDatatypes.$fShowEmployee_$cshowsPrec [InlPrag=INLINE[0]]
  :: GHC.Types.Int -> CompanyDatatypes.Employee -> GHC.Show.ShowS
[GblId,
 Arity=2,
 Str=DmdType U(L)U(LL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cshowsPrec2, TopLvl=True,
         Arity=2, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (w_s2cW [Occ=Once!] :: GHC.Types.Int)
                 (w3_s2d0 [Occ=Once!] :: CompanyDatatypes.Employee) ->
                 case w_s2cW of _ { GHC.Types.I# ww_s2cY [Occ=Once] ->
                 case w3_s2d0
                 of _
                 { CompanyDatatypes.E ww1_s2d2 [Occ=Once] ww2_s2d3 [Occ=Once] ->
                 CompanyDatatypes.$w$cshowsPrec2 ww_s2cY ww1_s2d2 ww2_s2d3
                 }
                 }}]
CompanyDatatypes.$fShowEmployee_$cshowsPrec =
  \ (w_s2cW :: GHC.Types.Int)
    (w3_s2d0 :: CompanyDatatypes.Employee) ->
    case w_s2cW of _ { GHC.Types.I# ww_s2cY ->
    case w3_s2d0 of _ { CompanyDatatypes.E ww1_s2d2 ww2_s2d3 ->
    CompanyDatatypes.$w$cshowsPrec2 ww_s2cY ww1_s2d2 ww2_s2d3
    }
    }

CompanyDatatypes.$fShowEmployee1
  :: CompanyDatatypes.Employee -> GHC.Show.ShowS
[GblId,
 Arity=1,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [20] 50 0}]
CompanyDatatypes.$fShowEmployee1 =
  \ (w_s2d0 :: CompanyDatatypes.Employee) ->
    case w_s2d0 of _ { CompanyDatatypes.E ww_s2d2 ww1_s2d3 ->
    CompanyDatatypes.$w$cshowsPrec2 0 ww_s2d2 ww1_s2d3
    }

CompanyDatatypes.$fShowEmployee_$cshowList
  :: [CompanyDatatypes.Employee] -> GHC.Show.ShowS
[GblId,
 Arity=2,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [] 20 60}]
CompanyDatatypes.$fShowEmployee_$cshowList =
  GHC.Show.showList__
    @ CompanyDatatypes.Employee CompanyDatatypes.$fShowEmployee1

CompanyDatatypes.$fShowEmployee_$cshow
  :: CompanyDatatypes.Employee -> GHC.Base.String
[GblId,
 Arity=1,
 Str=DmdType U(LL),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (x_a1dj [Occ=Once] :: CompanyDatatypes.Employee) ->
                 CompanyDatatypes.$fShowEmployee_$cshowsPrec
                   GHC.Show.shows26 x_a1dj (GHC.Types.[] @ GHC.Types.Char)}]
CompanyDatatypes.$fShowEmployee_$cshow =
  \ (x_a1dj :: CompanyDatatypes.Employee) ->
    case x_a1dj of _ { CompanyDatatypes.E ww_s2d2 ww1_s2d3 ->
    CompanyDatatypes.$w$cshowsPrec2
      0 ww_s2d2 ww1_s2d3 (GHC.Types.[] @ GHC.Types.Char)
    }

CompanyDatatypes.$fShowEmployee [InlPrag=[ALWAYS] CONLIKE]
  :: GHC.Show.Show CompanyDatatypes.Employee
[GblId[DFunId],
 Str=DmdType m,
 Unf=DFun(arity=0) GHC.Show.D:Show [{CompanyDatatypes.$fShowEmployee_$cshowsPrec},
                                    {CompanyDatatypes.$fShowEmployee_$cshow},
                                    {CompanyDatatypes.$fShowEmployee_$cshowList}]]
CompanyDatatypes.$fShowEmployee =
  GHC.Show.D:Show
    @ CompanyDatatypes.Employee
    CompanyDatatypes.$fShowEmployee_$cshowsPrec
    CompanyDatatypes.$fShowEmployee_$cshow
    CompanyDatatypes.$fShowEmployee_$cshowList

CompanyDatatypes.$fShowUnit1 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 40 0}]
CompanyDatatypes.$fShowUnit1 = GHC.CString.unpackCString# "DU "

CompanyDatatypes.$fShowUnit2 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 40 0}]
CompanyDatatypes.$fShowUnit2 = GHC.CString.unpackCString# "PU "

CompanyDatatypes.$fShowCompany3 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 40 0}]
CompanyDatatypes.$fShowCompany3 = GHC.CString.unpackCString# "D "

Rec {
CompanyDatatypes.$w$cshowsPrec1
  :: GHC.Prim.Int#
     -> CompanyDatatypes.Name
     -> CompanyDatatypes.Manager
     -> [CompanyDatatypes.Unit]
     -> GHC.Show.ShowS
[GblId,
 Arity=4,
 Str=DmdType LLLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=4, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [0 0 20 0] 371 120}]
CompanyDatatypes.$w$cshowsPrec1 =
  \ (ww_s2da :: GHC.Prim.Int#)
    (ww1_s2de :: CompanyDatatypes.Name)
    (ww2_s2df :: CompanyDatatypes.Manager)
    (ww3_s2dg :: [CompanyDatatypes.Unit]) ->
    let {
      f_X1wk [Dmd=Just L] :: GHC.Base.String -> GHC.Base.String
      [LclId, Str=DmdType]
      f_X1wk =
        case ww2_s2df of _ { CompanyDatatypes.E ww4_s2d2 ww5_s2d3 ->
        CompanyDatatypes.$w$cshowsPrec2 11 ww4_s2d2 ww5_s2d3
        } } in
    let {
      g_a1cL :: GHC.Base.String -> GHC.Base.String
      [LclId, Arity=1, Str=DmdType L]
      g_a1cL =
        \ (x_X1mG :: GHC.Base.String) ->
          GHC.Types.:
            @ GHC.Types.Char
            GHC.Show.$fShowChar1
            (GHC.Show.showLitString
               ww1_s2de
               (GHC.Types.:
                  @ GHC.Types.Char
                  GHC.Show.$fShowChar1
                  (GHC.Types.:
                     @ GHC.Types.Char
                     GHC.Show.showSpace1
                     (f_X1wk
                        (GHC.Types.:
                           @ GHC.Types.Char
                           GHC.Show.showSpace1
                           (GHC.Show.showList__
                              @ CompanyDatatypes.Unit
                              CompanyDatatypes.$fShowCompany4
                              ww3_s2dg
                              x_X1mG)))))) } in
    case GHC.Prim.>=# ww_s2da 11 of _ {
      GHC.Types.False ->
        \ (x_X1mI :: GHC.Base.String) ->
          GHC.Base.++
            @ GHC.Types.Char CompanyDatatypes.$fShowCompany3 (g_a1cL x_X1mI);
      GHC.Types.True ->
        \ (x_a1cp :: GHC.Base.String) ->
          GHC.Types.:
            @ GHC.Types.Char
            GHC.Show.shows11
            (GHC.Base.++
               @ GHC.Types.Char
               CompanyDatatypes.$fShowCompany3
               (g_a1cL (GHC.Types.: @ GHC.Types.Char GHC.Show.shows10 x_a1cp)))
    }

CompanyDatatypes.$w$cshowsPrec5
  :: GHC.Prim.Int# -> CompanyDatatypes.Unit -> GHC.Show.ShowS
[GblId,
 Arity=2,
 Str=DmdType LS,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [0 251] 472 240}]
CompanyDatatypes.$w$cshowsPrec5 =
  \ (ww_s2dn :: GHC.Prim.Int#) (w_s2dp :: CompanyDatatypes.Unit) ->
    case w_s2dp of _ {
      CompanyDatatypes.PU b1_aSL ->
        let {
          g_a1cL [Dmd=Just L] :: GHC.Base.String -> GHC.Base.String
          [LclId, Str=DmdType]
          g_a1cL =
            case b1_aSL of _ { CompanyDatatypes.E ww1_s2d2 ww2_s2d3 ->
            CompanyDatatypes.$w$cshowsPrec2 11 ww1_s2d2 ww2_s2d3
            } } in
        case GHC.Prim.>=# ww_s2dn 11 of _ {
          GHC.Types.False ->
            \ (x_a1cM :: GHC.Base.String) ->
              GHC.Base.++
                @ GHC.Types.Char CompanyDatatypes.$fShowUnit2 (g_a1cL x_a1cM);
          GHC.Types.True ->
            \ (x_a1cp :: GHC.Base.String) ->
              GHC.Types.:
                @ GHC.Types.Char
                GHC.Show.shows11
                (GHC.Base.++
                   @ GHC.Types.Char
                   CompanyDatatypes.$fShowUnit2
                   (g_a1cL (GHC.Types.: @ GHC.Types.Char GHC.Show.shows10 x_a1cp)))
        };
      CompanyDatatypes.DU b1_aSN ->
        let {
          g_a1cL [Dmd=Just L] :: GHC.Base.String -> GHC.Base.String
          [LclId, Str=DmdType]
          g_a1cL =
            case b1_aSN of _ { CompanyDatatypes.D ww1_s2de ww2_s2df ww3_s2dg ->
            CompanyDatatypes.$w$cshowsPrec1 11 ww1_s2de ww2_s2df ww3_s2dg
            } } in
        case GHC.Prim.>=# ww_s2dn 11 of _ {
          GHC.Types.False ->
            \ (x_a1cM :: GHC.Base.String) ->
              GHC.Base.++
                @ GHC.Types.Char CompanyDatatypes.$fShowUnit1 (g_a1cL x_a1cM);
          GHC.Types.True ->
            \ (x_a1cp :: GHC.Base.String) ->
              GHC.Types.:
                @ GHC.Types.Char
                GHC.Show.shows11
                (GHC.Base.++
                   @ GHC.Types.Char
                   CompanyDatatypes.$fShowUnit1
                   (g_a1cL (GHC.Types.: @ GHC.Types.Char GHC.Show.shows10 x_a1cp)))
        }
    }

CompanyDatatypes.$fShowCompany4 [Occ=LoopBreaker]
  :: CompanyDatatypes.Unit -> GHC.Show.ShowS
[GblId, Arity=1, Str=DmdType]
CompanyDatatypes.$fShowCompany4 =
  \ (w_s2dp :: CompanyDatatypes.Unit) ->
    CompanyDatatypes.$w$cshowsPrec5 0 w_s2dp
end Rec }

CompanyDatatypes.$fShowDept_$cshowsPrec [InlPrag=INLINE[0]]
  :: GHC.Types.Int -> CompanyDatatypes.Dept -> GHC.Show.ShowS
[GblId,
 Arity=2,
 Str=DmdType U(L)U(LLL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cshowsPrec1, TopLvl=True,
         Arity=2, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (w_s2d8 [Occ=Once!] :: GHC.Types.Int)
                 (w3_s2dc [Occ=Once!] :: CompanyDatatypes.Dept) ->
                 case w_s2d8 of _ { GHC.Types.I# ww_s2da [Occ=Once] ->
                 case w3_s2dc
                 of _
                 { CompanyDatatypes.D ww1_s2de [Occ=Once]
                                      ww2_s2df [Occ=Once]
                                      ww3_s2dg [Occ=Once] ->
                 CompanyDatatypes.$w$cshowsPrec1 ww_s2da ww1_s2de ww2_s2df ww3_s2dg
                 }
                 }}]
CompanyDatatypes.$fShowDept_$cshowsPrec =
  \ (w_s2d8 :: GHC.Types.Int) (w3_s2dc :: CompanyDatatypes.Dept) ->
    case w_s2d8 of _ { GHC.Types.I# ww_s2da ->
    case w3_s2dc
    of _ { CompanyDatatypes.D ww1_s2de ww2_s2df ww3_s2dg ->
    CompanyDatatypes.$w$cshowsPrec1 ww_s2da ww1_s2de ww2_s2df ww3_s2dg
    }
    }

CompanyDatatypes.$fShowUnit_$cshowsPrec [InlPrag=INLINE[0]]
  :: GHC.Types.Int -> CompanyDatatypes.Unit -> GHC.Show.ShowS
[GblId,
 Arity=2,
 Str=DmdType U(L)S,
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cshowsPrec5, TopLvl=True,
         Arity=2, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (w_s2dl [Occ=Once!] :: GHC.Types.Int)
                 (w3_s2dp [Occ=Once] :: CompanyDatatypes.Unit) ->
                 case w_s2dl of _ { GHC.Types.I# ww_s2dn [Occ=Once] ->
                 CompanyDatatypes.$w$cshowsPrec5 ww_s2dn w3_s2dp
                 }}]
CompanyDatatypes.$fShowUnit_$cshowsPrec =
  \ (w_s2dl :: GHC.Types.Int) (w3_s2dp :: CompanyDatatypes.Unit) ->
    case w_s2dl of _ { GHC.Types.I# ww_s2dn ->
    CompanyDatatypes.$w$cshowsPrec5 ww_s2dn w3_s2dp
    }

CompanyDatatypes.$fShowUnit_$cshow
  :: CompanyDatatypes.Unit -> GHC.Base.String
[GblId,
 Arity=1,
 Str=DmdType S,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [0] 40 0}]
CompanyDatatypes.$fShowUnit_$cshow =
  \ (x_a1dj :: CompanyDatatypes.Unit) ->
    CompanyDatatypes.$w$cshowsPrec5
      0 x_a1dj (GHC.Types.[] @ GHC.Types.Char)

CompanyDatatypes.$fShowUnit_$cshowList
  :: [CompanyDatatypes.Unit] -> GHC.Show.ShowS
[GblId,
 Arity=2,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [] 20 60}]
CompanyDatatypes.$fShowUnit_$cshowList =
  GHC.Show.showList__
    @ CompanyDatatypes.Unit CompanyDatatypes.$fShowCompany4

CompanyDatatypes.$fShowUnit [InlPrag=[ALWAYS] CONLIKE]
  :: GHC.Show.Show CompanyDatatypes.Unit
[GblId[DFunId],
 Str=DmdType m,
 Unf=DFun(arity=0) GHC.Show.D:Show [{CompanyDatatypes.$fShowUnit_$cshowsPrec},
                                    {CompanyDatatypes.$fShowUnit_$cshow},
                                    {CompanyDatatypes.$fShowUnit_$cshowList}]]
CompanyDatatypes.$fShowUnit =
  GHC.Show.D:Show
    @ CompanyDatatypes.Unit
    CompanyDatatypes.$fShowUnit_$cshowsPrec
    CompanyDatatypes.$fShowUnit_$cshow
    CompanyDatatypes.$fShowUnit_$cshowList

CompanyDatatypes.$fShowCompany2
  :: CompanyDatatypes.Dept -> GHC.Show.ShowS
[GblId,
 Arity=1,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [20] 60 0}]
CompanyDatatypes.$fShowCompany2 =
  \ (w_s2dc :: CompanyDatatypes.Dept) ->
    case w_s2dc of _ { CompanyDatatypes.D ww_s2de ww1_s2df ww2_s2dg ->
    CompanyDatatypes.$w$cshowsPrec1 0 ww_s2de ww1_s2df ww2_s2dg
    }

CompanyDatatypes.$fShowDept_$cshowList
  :: [CompanyDatatypes.Dept] -> GHC.Show.ShowS
[GblId,
 Arity=2,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [] 20 60}]
CompanyDatatypes.$fShowDept_$cshowList =
  GHC.Show.showList__
    @ CompanyDatatypes.Dept CompanyDatatypes.$fShowCompany2

CompanyDatatypes.$fShowDept_$cshow
  :: CompanyDatatypes.Dept -> GHC.Base.String
[GblId,
 Arity=1,
 Str=DmdType U(LLL),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (x_a1dj [Occ=Once] :: CompanyDatatypes.Dept) ->
                 CompanyDatatypes.$fShowDept_$cshowsPrec
                   GHC.Show.shows26 x_a1dj (GHC.Types.[] @ GHC.Types.Char)}]
CompanyDatatypes.$fShowDept_$cshow =
  \ (x_a1dj :: CompanyDatatypes.Dept) ->
    case x_a1dj of _ { CompanyDatatypes.D ww_s2de ww1_s2df ww2_s2dg ->
    CompanyDatatypes.$w$cshowsPrec1
      0 ww_s2de ww1_s2df ww2_s2dg (GHC.Types.[] @ GHC.Types.Char)
    }

CompanyDatatypes.$fShowDept [InlPrag=[ALWAYS] CONLIKE]
  :: GHC.Show.Show CompanyDatatypes.Dept
[GblId[DFunId],
 Str=DmdType m,
 Unf=DFun(arity=0) GHC.Show.D:Show [{CompanyDatatypes.$fShowDept_$cshowsPrec},
                                    {CompanyDatatypes.$fShowDept_$cshow},
                                    {CompanyDatatypes.$fShowDept_$cshowList}]]
CompanyDatatypes.$fShowDept =
  GHC.Show.D:Show
    @ CompanyDatatypes.Dept
    CompanyDatatypes.$fShowDept_$cshowsPrec
    CompanyDatatypes.$fShowDept_$cshow
    CompanyDatatypes.$fShowDept_$cshowList

CompanyDatatypes.$fShowCompany9 :: [GHC.Types.Char]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 40 0}]
CompanyDatatypes.$fShowCompany9 = GHC.CString.unpackCString# "C "

CompanyDatatypes.$w$cshowsPrec
  :: GHC.Prim.Int#
     -> [CompanyDatatypes.Dept] -> GHC.Base.String -> GHC.Base.String
[GblId,
 Arity=3,
 Str=DmdType LLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=3, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [0 0 0] 181 30}]
CompanyDatatypes.$w$cshowsPrec =
  \ (ww_s2dw :: GHC.Prim.Int#)
    (ww1_s2dA :: [CompanyDatatypes.Dept])
    (w_s2dC :: GHC.Base.String) ->
    case GHC.Prim.>=# ww_s2dw 11 of _ {
      GHC.Types.False ->
        GHC.Base.++
          @ GHC.Types.Char
          CompanyDatatypes.$fShowCompany9
          (GHC.Show.showList__
             @ CompanyDatatypes.Dept
             CompanyDatatypes.$fShowCompany2
             ww1_s2dA
             w_s2dC);
      GHC.Types.True ->
        GHC.Types.:
          @ GHC.Types.Char
          GHC.Show.shows11
          (GHC.Base.++
             @ GHC.Types.Char
             CompanyDatatypes.$fShowCompany9
             (GHC.Show.showList__
                @ CompanyDatatypes.Dept
                CompanyDatatypes.$fShowCompany2
                ww1_s2dA
                (GHC.Types.: @ GHC.Types.Char GHC.Show.shows10 w_s2dC)))
    }

CompanyDatatypes.$fShowCompany_$cshowsPrec [InlPrag=INLINE[0]]
  :: GHC.Types.Int -> CompanyDatatypes.Company -> GHC.Show.ShowS
[GblId,
 Arity=3,
 Str=DmdType U(L)U(L)L,
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cshowsPrec, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (w_s2du [Occ=Once!] :: GHC.Types.Int)
                 (w3_s2dy [Occ=Once!] :: CompanyDatatypes.Company)
                 (w4_s2dC [Occ=Once] :: GHC.Base.String) ->
                 case w_s2du of _ { GHC.Types.I# ww_s2dw [Occ=Once] ->
                 case w3_s2dy of _ { CompanyDatatypes.C ww1_s2dA [Occ=Once] ->
                 CompanyDatatypes.$w$cshowsPrec ww_s2dw ww1_s2dA w4_s2dC
                 }
                 }}]
CompanyDatatypes.$fShowCompany_$cshowsPrec =
  \ (w_s2du :: GHC.Types.Int)
    (w3_s2dy :: CompanyDatatypes.Company)
    (w4_s2dC :: GHC.Base.String) ->
    case w_s2du of _ { GHC.Types.I# ww_s2dw ->
    case w3_s2dy of _ { CompanyDatatypes.C ww1_s2dA ->
    CompanyDatatypes.$w$cshowsPrec ww_s2dw ww1_s2dA w4_s2dC
    }
    }

CompanyDatatypes.$fShowCompany1
  :: CompanyDatatypes.Company -> GHC.Show.ShowS
[GblId,
 Arity=2,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [20 0] 50 0}]
CompanyDatatypes.$fShowCompany1 =
  \ (w_s2dy :: CompanyDatatypes.Company)
    (w3_s2dC :: GHC.Base.String) ->
    case w_s2dy of _ { CompanyDatatypes.C ww_s2dA ->
    CompanyDatatypes.$w$cshowsPrec 0 ww_s2dA w3_s2dC
    }

CompanyDatatypes.$fShowCompany_$cshowList
  :: [CompanyDatatypes.Company] -> GHC.Show.ShowS
[GblId,
 Arity=2,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [] 20 60}]
CompanyDatatypes.$fShowCompany_$cshowList =
  GHC.Show.showList__
    @ CompanyDatatypes.Company CompanyDatatypes.$fShowCompany1

CompanyDatatypes.$fShowCompany_$cshow
  :: CompanyDatatypes.Company -> GHC.Base.String
[GblId,
 Arity=1,
 Str=DmdType U(L),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (x_a1dj [Occ=Once] :: CompanyDatatypes.Company) ->
                 CompanyDatatypes.$fShowCompany_$cshowsPrec
                   GHC.Show.shows26 x_a1dj (GHC.Types.[] @ GHC.Types.Char)}]
CompanyDatatypes.$fShowCompany_$cshow =
  \ (x_a1dj :: CompanyDatatypes.Company) ->
    case x_a1dj of _ { CompanyDatatypes.C ww_s2dA ->
    CompanyDatatypes.$w$cshowsPrec
      0 ww_s2dA (GHC.Types.[] @ GHC.Types.Char)
    }

CompanyDatatypes.$fShowCompany [InlPrag=[ALWAYS] CONLIKE]
  :: GHC.Show.Show CompanyDatatypes.Company
[GblId[DFunId],
 Str=DmdType m,
 Unf=DFun(arity=0) GHC.Show.D:Show [{CompanyDatatypes.$fShowCompany_$cshowsPrec},
                                    {CompanyDatatypes.$fShowCompany_$cshow},
                                    {CompanyDatatypes.$fShowCompany_$cshowList}]]
CompanyDatatypes.$fShowCompany =
  GHC.Show.D:Show
    @ CompanyDatatypes.Company
    CompanyDatatypes.$fShowCompany_$cshowsPrec
    CompanyDatatypes.$fShowCompany_$cshow
    CompanyDatatypes.$fShowCompany_$cshowList

CompanyDatatypes.$fEqEmployee_$c==1
  :: CompanyDatatypes.Salary
     -> CompanyDatatypes.Salary -> GHC.Types.Bool
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType U(U(L))U(U(L)),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (ds_d14N [Occ=Once!] :: CompanyDatatypes.Salary)
                 (ds1_d14O [Occ=Once!] :: CompanyDatatypes.Salary) ->
                 case ds_d14N of _ { CompanyDatatypes.S a22_aRZ [Occ=Once] ->
                 case ds1_d14O of _ { CompanyDatatypes.S b1_aS0 [Occ=Once] ->
                 GHC.Classes.$fEqFloat_$c== a22_aRZ b1_aS0
                 }
                 }}]
CompanyDatatypes.$fEqEmployee_$c==1 =
  \ (ds_d14N :: CompanyDatatypes.Salary)
    (ds1_d14O :: CompanyDatatypes.Salary) ->
    case ds_d14N of _ { CompanyDatatypes.S a22_aRZ ->
    case ds1_d14O of _ { CompanyDatatypes.S b1_aS0 ->
    GHC.Classes.$fEqFloat_$c== a22_aRZ b1_aS0
    }
    }

CompanyDatatypes.$fEqSalary_$c/=
  :: CompanyDatatypes.Salary
     -> CompanyDatatypes.Salary -> GHC.Types.Bool
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType U(U(L))U(U(L)),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (a22_aS1 [Occ=Once!] :: CompanyDatatypes.Salary)
                 (b_aS2 [Occ=Once!] :: CompanyDatatypes.Salary) ->
                 case a22_aS1 of _ { CompanyDatatypes.S a23_aRZ [Occ=Once!] ->
                 case b_aS2 of _ { CompanyDatatypes.S b1_aS0 [Occ=Once!] ->
                 case a23_aRZ of _ { GHC.Types.F# x_a1dT [Occ=Once] ->
                 case b1_aS0 of _ { GHC.Types.F# y_a1dX [Occ=Once] ->
                 case GHC.Prim.eqFloat# x_a1dT y_a1dX of _ {
                   GHC.Types.False -> GHC.Types.True;
                   GHC.Types.True -> GHC.Types.False
                 }
                 }
                 }
                 }
                 }}]
CompanyDatatypes.$fEqSalary_$c/= =
  \ (a22_aS1 :: CompanyDatatypes.Salary)
    (b_aS2 :: CompanyDatatypes.Salary) ->
    case a22_aS1 of _ { CompanyDatatypes.S a23_aRZ ->
    case b_aS2 of _ { CompanyDatatypes.S b1_aS0 ->
    case a23_aRZ of _ { GHC.Types.F# x_a1dT ->
    case b1_aS0 of _ { GHC.Types.F# y_a1dX ->
    case GHC.Prim.eqFloat# x_a1dT y_a1dX of _ {
      GHC.Types.False -> GHC.Types.True;
      GHC.Types.True -> GHC.Types.False
    }
    }
    }
    }
    }

CompanyDatatypes.$fEqSalary [InlPrag=[ALWAYS] CONLIKE]
  :: GHC.Classes.Eq CompanyDatatypes.Salary
[GblId[DFunId],
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=DFun(arity=0) GHC.Classes.D:Eq [{CompanyDatatypes.$fEqEmployee_$c==1},
                                     {CompanyDatatypes.$fEqSalary_$c/=}]]
CompanyDatatypes.$fEqSalary =
  GHC.Classes.D:Eq
    @ CompanyDatatypes.Salary
    CompanyDatatypes.$fEqEmployee_$c==1
    CompanyDatatypes.$fEqSalary_$c/=

CompanyDatatypes.$w$c==1
  :: CompanyDatatypes.Name
     -> CompanyDatatypes.Address
     -> CompanyDatatypes.Salary
     -> CompanyDatatypes.Name
     -> CompanyDatatypes.Address
     -> CompanyDatatypes.Salary
     -> GHC.Types.Bool
[GblId,
 Arity=6,
 Caf=NoCafRefs,
 Str=DmdType SLLSLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=6, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [0 0 0 0 0 0] 130 20}]
CompanyDatatypes.$w$c==1 =
  \ (ww_s2dK :: CompanyDatatypes.Name)
    (ww1_s2dL :: CompanyDatatypes.Address)
    (ww2_s2dN :: CompanyDatatypes.Salary)
    (ww3_s2dT :: CompanyDatatypes.Name)
    (ww4_s2dU :: CompanyDatatypes.Address)
    (ww5_s2dW :: CompanyDatatypes.Salary) ->
    case GHC.Base.eqString ww_s2dK ww3_s2dT of _ {
      GHC.Types.False -> GHC.Types.False;
      GHC.Types.True ->
        case GHC.Base.eqString ww1_s2dL ww4_s2dU of _ {
          GHC.Types.False -> GHC.Types.False;
          GHC.Types.True ->
            CompanyDatatypes.$fEqEmployee_$c==1 ww2_s2dN ww5_s2dW
        }
    }

CompanyDatatypes.$fEqEmployee_$c== [InlPrag=INLINE[0]]
  :: CompanyDatatypes.Employee
     -> CompanyDatatypes.Employee -> GHC.Types.Bool
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType U(U(SL)L)U(U(SL)L),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$c==1, TopLvl=True, Arity=2,
         Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (w_s2dG [Occ=Once!] :: CompanyDatatypes.Employee)
                 (w3_s2dP [Occ=Once!] :: CompanyDatatypes.Employee) ->
                 case w_s2dG
                 of _
                 { CompanyDatatypes.E ww_s2dI [Occ=Once!] ww1_s2dN [Occ=Once] ->
                 case ww_s2dI
                 of _
                 { CompanyDatatypes.P ww3_s2dK [Occ=Once] ww4_s2dL [Occ=Once] ->
                 case w3_s2dP
                 of _
                 { CompanyDatatypes.E ww5_s2dR [Occ=Once!] ww6_s2dW [Occ=Once] ->
                 case ww5_s2dR
                 of _
                 { CompanyDatatypes.P ww8_s2dT [Occ=Once] ww9_s2dU [Occ=Once] ->
                 CompanyDatatypes.$w$c==1
                   ww3_s2dK ww4_s2dL ww1_s2dN ww8_s2dT ww9_s2dU ww6_s2dW
                 }
                 }
                 }
                 }}]
CompanyDatatypes.$fEqEmployee_$c== =
  \ (w_s2dG :: CompanyDatatypes.Employee)
    (w3_s2dP :: CompanyDatatypes.Employee) ->
    case w_s2dG of _ { CompanyDatatypes.E ww_s2dI ww1_s2dN ->
    case ww_s2dI of _ { CompanyDatatypes.P ww3_s2dK ww4_s2dL ->
    case w3_s2dP of _ { CompanyDatatypes.E ww5_s2dR ww6_s2dW ->
    case ww5_s2dR of _ { CompanyDatatypes.P ww8_s2dT ww9_s2dU ->
    CompanyDatatypes.$w$c==1
      ww3_s2dK ww4_s2dL ww1_s2dN ww8_s2dT ww9_s2dU ww6_s2dW
    }
    }
    }
    }

CompanyDatatypes.$fEqEmployee_$c/=
  :: CompanyDatatypes.Employee
     -> CompanyDatatypes.Employee -> GHC.Types.Bool
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType U(U(SL)L)U(U(SL)L),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (a22_aSt [Occ=Once] :: CompanyDatatypes.Employee)
                 (b_aSu [Occ=Once] :: CompanyDatatypes.Employee) ->
                 case CompanyDatatypes.$fEqEmployee_$c== a22_aSt b_aSu of _ {
                   GHC.Types.False -> GHC.Types.True;
                   GHC.Types.True -> GHC.Types.False
                 }}]
CompanyDatatypes.$fEqEmployee_$c/= =
  \ (a22_aSt :: CompanyDatatypes.Employee)
    (b_aSu :: CompanyDatatypes.Employee) ->
    case a22_aSt of _ { CompanyDatatypes.E ww_s2dI ww1_s2dN ->
    case ww_s2dI of _ { CompanyDatatypes.P ww3_s2dK ww4_s2dL ->
    case b_aSu of _ { CompanyDatatypes.E ww5_s2dR ww6_s2dW ->
    case ww5_s2dR of _ { CompanyDatatypes.P ww8_s2dT ww9_s2dU ->
    case GHC.Base.eqString ww3_s2dK ww8_s2dT of _ {
      GHC.Types.False -> GHC.Types.True;
      GHC.Types.True ->
        case GHC.Base.eqString ww4_s2dL ww9_s2dU of _ {
          GHC.Types.False -> GHC.Types.True;
          GHC.Types.True ->
            case ww1_s2dN of _ { CompanyDatatypes.S a23_aRZ ->
            case ww6_s2dW of _ { CompanyDatatypes.S b1_aS0 ->
            case a23_aRZ of _ { GHC.Types.F# x_a1dT ->
            case b1_aS0 of _ { GHC.Types.F# y_a1dX ->
            case GHC.Prim.eqFloat# x_a1dT y_a1dX of _ {
              GHC.Types.False -> GHC.Types.True;
              GHC.Types.True -> GHC.Types.False
            }
            }
            }
            }
            }
        }
    }
    }
    }
    }
    }

CompanyDatatypes.$fEqEmployee [InlPrag=[ALWAYS] CONLIKE]
  :: GHC.Classes.Eq CompanyDatatypes.Employee
[GblId[DFunId],
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=DFun(arity=0) GHC.Classes.D:Eq [{CompanyDatatypes.$fEqEmployee_$c==},
                                     {CompanyDatatypes.$fEqEmployee_$c/=}]]
CompanyDatatypes.$fEqEmployee =
  GHC.Classes.D:Eq
    @ CompanyDatatypes.Employee
    CompanyDatatypes.$fEqEmployee_$c==
    CompanyDatatypes.$fEqEmployee_$c/=

Rec {
CompanyDatatypes.$fEqUnit [InlPrag=[ALWAYS] CONLIKE]
  :: GHC.Classes.Eq CompanyDatatypes.Unit
[GblId[DFunId],
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=DFun(arity=0) GHC.Classes.D:Eq [{CompanyDatatypes.$fEqUnit_$c==},
                                     {CompanyDatatypes.$fEqUnit_$c/=}]]
CompanyDatatypes.$fEqUnit =
  GHC.Classes.D:Eq
    @ CompanyDatatypes.Unit
    CompanyDatatypes.$fEqUnit_$c==
    CompanyDatatypes.$fEqUnit_$c/=

CompanyDatatypes.$w$c==
  :: CompanyDatatypes.Name
     -> CompanyDatatypes.Manager
     -> [CompanyDatatypes.Unit]
     -> CompanyDatatypes.Name
     -> CompanyDatatypes.Manager
     -> [CompanyDatatypes.Unit]
     -> GHC.Types.Bool
[GblId,
 Arity=6,
 Caf=NoCafRefs,
 Str=DmdType SLLSLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=6, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [0 20 0 0 20 0] 291 40}]
CompanyDatatypes.$w$c== =
  \ (ww_s2e3 :: CompanyDatatypes.Name)
    (ww1_s2e4 :: CompanyDatatypes.Manager)
    (ww2_s2e5 :: [CompanyDatatypes.Unit])
    (ww3_s2e9 :: CompanyDatatypes.Name)
    (ww4_s2ea :: CompanyDatatypes.Manager)
    (ww5_s2eb :: [CompanyDatatypes.Unit]) ->
    case GHC.Base.eqString ww_s2e3 ww3_s2e9 of _ {
      GHC.Types.False -> GHC.Types.False;
      GHC.Types.True ->
        case ww1_s2e4 of _ { CompanyDatatypes.E ww6_s2dI ww7_s2dN ->
        case ww6_s2dI of _ { CompanyDatatypes.P ww9_s2dK ww10_s2dL ->
        case ww4_s2ea of _ { CompanyDatatypes.E ww11_s2dR ww12_s2dW ->
        case ww11_s2dR of _ { CompanyDatatypes.P ww14_s2dT ww15_s2dU ->
        case GHC.Base.eqString ww9_s2dK ww14_s2dT of _ {
          GHC.Types.False -> GHC.Types.False;
          GHC.Types.True ->
            case GHC.Base.eqString ww10_s2dL ww15_s2dU of _ {
              GHC.Types.False -> GHC.Types.False;
              GHC.Types.True ->
                case ww7_s2dN of _ { CompanyDatatypes.S a22_aRZ ->
                case ww12_s2dW of _ { CompanyDatatypes.S b1_aS0 ->
                case a22_aRZ of _ { GHC.Types.F# x_a1dT ->
                case b1_aS0 of _ { GHC.Types.F# y_a1dX ->
                case GHC.Prim.eqFloat# x_a1dT y_a1dX of _ {
                  GHC.Types.False -> GHC.Types.False;
                  GHC.Types.True ->
                    GHC.Classes.$fEq[]_$c==
                      @ CompanyDatatypes.Unit CompanyDatatypes.$fEqUnit ww2_s2e5 ww5_s2eb
                }
                }
                }
                }
                }
            }
        }
        }
        }
        }
        }
    }

CompanyDatatypes.$fEqUnit_$c/= [Occ=LoopBreaker]
  :: CompanyDatatypes.Unit -> CompanyDatatypes.Unit -> GHC.Types.Bool
[GblId, Arity=2, Caf=NoCafRefs, Str=DmdType SS]
CompanyDatatypes.$fEqUnit_$c/= =
  \ (a22_aSI :: CompanyDatatypes.Unit)
    (b_aSJ :: CompanyDatatypes.Unit) ->
    case a22_aSI of _ {
      CompanyDatatypes.PU a23_aSE ->
        case b_aSJ of _ {
          CompanyDatatypes.PU b1_aSF ->
            case a23_aSE of _ { CompanyDatatypes.E ww_s2dI ww1_s2dN ->
            case ww_s2dI of _ { CompanyDatatypes.P ww3_s2dK ww4_s2dL ->
            case b1_aSF of _ { CompanyDatatypes.E ww5_s2dR ww6_s2dW ->
            case ww5_s2dR of _ { CompanyDatatypes.P ww8_s2dT ww9_s2dU ->
            case GHC.Base.eqString ww3_s2dK ww8_s2dT of _ {
              GHC.Types.False -> GHC.Types.True;
              GHC.Types.True ->
                case GHC.Base.eqString ww4_s2dL ww9_s2dU of _ {
                  GHC.Types.False -> GHC.Types.True;
                  GHC.Types.True ->
                    case ww1_s2dN of _ { CompanyDatatypes.S a24_aRZ ->
                    case ww6_s2dW of _ { CompanyDatatypes.S b2_aS0 ->
                    case a24_aRZ of _ { GHC.Types.F# x_a1dT ->
                    case b2_aS0 of _ { GHC.Types.F# y_a1dX ->
                    case GHC.Prim.eqFloat# x_a1dT y_a1dX of _ {
                      GHC.Types.False -> GHC.Types.True;
                      GHC.Types.True -> GHC.Types.False
                    }
                    }
                    }
                    }
                    }
                }
            }
            }
            }
            }
            };
          CompanyDatatypes.DU ipv_s1e5 -> GHC.Types.True
        };
      CompanyDatatypes.DU a23_aSG ->
        case b_aSJ of _ {
          CompanyDatatypes.PU ipv_s1e8 -> GHC.Types.True;
          CompanyDatatypes.DU b1_aSH ->
            case a23_aSG of _ { CompanyDatatypes.D ww_s2e3 ww1_s2e4 ww2_s2e5 ->
            case b1_aSH of _ { CompanyDatatypes.D ww3_s2e9 ww4_s2ea ww5_s2eb ->
            case CompanyDatatypes.$w$c==
                   ww_s2e3 ww1_s2e4 ww2_s2e5 ww3_s2e9 ww4_s2ea ww5_s2eb
            of _ {
              GHC.Types.False -> GHC.Types.True;
              GHC.Types.True -> GHC.Types.False
            }
            }
            }
        }
    }

CompanyDatatypes.$fEqDept_$c== [InlPrag=INLINE[0]]
  :: CompanyDatatypes.Dept -> CompanyDatatypes.Dept -> GHC.Types.Bool
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType U(SLL)U(SLL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$c==, TopLvl=True, Arity=2,
         Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (w_s2e1 [Occ=Once!] :: CompanyDatatypes.Dept)
                 (w3_s2e7 [Occ=Once!] :: CompanyDatatypes.Dept) ->
                 case w_s2e1
                 of _
                 { CompanyDatatypes.D ww_s2e3 [Occ=Once]
                                      ww1_s2e4 [Occ=Once]
                                      ww2_s2e5 [Occ=Once] ->
                 case w3_s2e7
                 of _
                 { CompanyDatatypes.D ww3_s2e9 [Occ=Once]
                                      ww4_s2ea [Occ=Once]
                                      ww5_s2eb [Occ=Once] ->
                 CompanyDatatypes.$w$c==
                   ww_s2e3 ww1_s2e4 ww2_s2e5 ww3_s2e9 ww4_s2ea ww5_s2eb
                 }
                 }}]
CompanyDatatypes.$fEqDept_$c== =
  \ (w_s2e1 :: CompanyDatatypes.Dept)
    (w3_s2e7 :: CompanyDatatypes.Dept) ->
    case w_s2e1 of _ { CompanyDatatypes.D ww_s2e3 ww1_s2e4 ww2_s2e5 ->
    case w3_s2e7
    of _ { CompanyDatatypes.D ww3_s2e9 ww4_s2ea ww5_s2eb ->
    CompanyDatatypes.$w$c==
      ww_s2e3 ww1_s2e4 ww2_s2e5 ww3_s2e9 ww4_s2ea ww5_s2eb
    }
    }

CompanyDatatypes.$fEqUnit_$c== [Occ=LoopBreaker]
  :: CompanyDatatypes.Unit -> CompanyDatatypes.Unit -> GHC.Types.Bool
[GblId, Arity=2, Caf=NoCafRefs, Str=DmdType SS]
CompanyDatatypes.$fEqUnit_$c== =
  \ (ds_d15s :: CompanyDatatypes.Unit)
    (ds1_d15t :: CompanyDatatypes.Unit) ->
    case ds_d15s of _ {
      CompanyDatatypes.PU a22_aSE ->
        case ds1_d15t of _ {
          CompanyDatatypes.PU b1_aSF ->
            CompanyDatatypes.$fEqEmployee_$c== a22_aSE b1_aSF;
          CompanyDatatypes.DU ipv_s1e5 -> GHC.Types.False
        };
      CompanyDatatypes.DU a22_aSG ->
        case ds1_d15t of _ {
          CompanyDatatypes.PU ipv_s1e8 -> GHC.Types.False;
          CompanyDatatypes.DU b1_aSH ->
            CompanyDatatypes.$fEqDept_$c== a22_aSG b1_aSH
        }
    }
end Rec }

CompanyDatatypes.$fEqDept_$c/=
  :: CompanyDatatypes.Dept -> CompanyDatatypes.Dept -> GHC.Types.Bool
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType U(SLL)U(SLL),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (a22_aT3 [Occ=Once] :: CompanyDatatypes.Dept)
                 (b_aT4 [Occ=Once] :: CompanyDatatypes.Dept) ->
                 case CompanyDatatypes.$fEqDept_$c== a22_aT3 b_aT4 of _ {
                   GHC.Types.False -> GHC.Types.True;
                   GHC.Types.True -> GHC.Types.False
                 }}]
CompanyDatatypes.$fEqDept_$c/= =
  \ (a22_aT3 :: CompanyDatatypes.Dept)
    (b_aT4 :: CompanyDatatypes.Dept) ->
    case a22_aT3 of _ { CompanyDatatypes.D ww_s2e3 ww1_s2e4 ww2_s2e5 ->
    case b_aT4 of _ { CompanyDatatypes.D ww3_s2e9 ww4_s2ea ww5_s2eb ->
    case CompanyDatatypes.$w$c==
           ww_s2e3 ww1_s2e4 ww2_s2e5 ww3_s2e9 ww4_s2ea ww5_s2eb
    of _ {
      GHC.Types.False -> GHC.Types.True;
      GHC.Types.True -> GHC.Types.False
    }
    }
    }

CompanyDatatypes.$fEqDept [InlPrag=[ALWAYS] CONLIKE]
  :: GHC.Classes.Eq CompanyDatatypes.Dept
[GblId[DFunId],
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=DFun(arity=0) GHC.Classes.D:Eq [{CompanyDatatypes.$fEqDept_$c==},
                                     {CompanyDatatypes.$fEqDept_$c/=}]]
CompanyDatatypes.$fEqDept =
  GHC.Classes.D:Eq
    @ CompanyDatatypes.Dept
    CompanyDatatypes.$fEqDept_$c==
    CompanyDatatypes.$fEqDept_$c/=

CompanyDatatypes.$fEqCompany_$c==
  :: CompanyDatatypes.Company
     -> CompanyDatatypes.Company -> GHC.Types.Bool
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType U(S)U(S),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (ds_d166 [Occ=Once!] :: CompanyDatatypes.Company)
                 (ds1_d167 [Occ=Once!] :: CompanyDatatypes.Company) ->
                 case ds_d166 of _ { CompanyDatatypes.C a22_aTg [Occ=Once] ->
                 case ds1_d167 of _ { CompanyDatatypes.C b1_aTh [Occ=Once] ->
                 GHC.Classes.$fEq[]_$c==
                   @ CompanyDatatypes.Dept CompanyDatatypes.$fEqDept a22_aTg b1_aTh
                 }
                 }}]
CompanyDatatypes.$fEqCompany_$c== =
  \ (ds_d166 :: CompanyDatatypes.Company)
    (ds1_d167 :: CompanyDatatypes.Company) ->
    case ds_d166 of _ { CompanyDatatypes.C a22_aTg ->
    case ds1_d167 of _ { CompanyDatatypes.C b1_aTh ->
    GHC.Classes.$fEq[]_$c==
      @ CompanyDatatypes.Dept CompanyDatatypes.$fEqDept a22_aTg b1_aTh
    }
    }

CompanyDatatypes.$fEqCompany_$c/=
  :: CompanyDatatypes.Company
     -> CompanyDatatypes.Company -> GHC.Types.Bool
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType U(S)U(S),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (a22_aTi [Occ=Once!] :: CompanyDatatypes.Company)
                 (b_aTj [Occ=Once!] :: CompanyDatatypes.Company) ->
                 case a22_aTi of _ { CompanyDatatypes.C a23_aTg [Occ=Once] ->
                 case b_aTj of _ { CompanyDatatypes.C b1_aTh [Occ=Once] ->
                 case GHC.Classes.$fEq[]_$c==
                        @ CompanyDatatypes.Dept CompanyDatatypes.$fEqDept a23_aTg b1_aTh
                 of _ {
                   GHC.Types.False -> GHC.Types.True;
                   GHC.Types.True -> GHC.Types.False
                 }
                 }
                 }}]
CompanyDatatypes.$fEqCompany_$c/= =
  \ (a22_aTi :: CompanyDatatypes.Company)
    (b_aTj :: CompanyDatatypes.Company) ->
    case a22_aTi of _ { CompanyDatatypes.C a23_aTg ->
    case b_aTj of _ { CompanyDatatypes.C b1_aTh ->
    case GHC.Classes.$fEq[]_$c==
           @ CompanyDatatypes.Dept CompanyDatatypes.$fEqDept a23_aTg b1_aTh
    of _ {
      GHC.Types.False -> GHC.Types.True;
      GHC.Types.True -> GHC.Types.False
    }
    }
    }

CompanyDatatypes.$fEqCompany [InlPrag=[ALWAYS] CONLIKE]
  :: GHC.Classes.Eq CompanyDatatypes.Company
[GblId[DFunId],
 Caf=NoCafRefs,
 Str=DmdType m,
 Unf=DFun(arity=0) GHC.Classes.D:Eq [{CompanyDatatypes.$fEqCompany_$c==},
                                     {CompanyDatatypes.$fEqCompany_$c/=}]]
CompanyDatatypes.$fEqCompany =
  GHC.Classes.D:Eq
    @ CompanyDatatypes.Company
    CompanyDatatypes.$fEqCompany_$c==
    CompanyDatatypes.$fEqCompany_$c/=

CompanyDatatypes.$fTypeableUnit_ds :: GHC.Base.String
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 40 0}]
CompanyDatatypes.$fTypeableUnit_ds =
  GHC.CString.unpackCString# "main"

CompanyDatatypes.$fTypeableUnit_ds1 :: GHC.Base.String
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 70 0}]
CompanyDatatypes.$fTypeableUnit_ds1 =
  GHC.CString.unpackCString# "CompanyDatatypes"

CompanyDatatypes.$fTypeableCompany_ds2 :: GHC.Base.String
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 50 0}]
CompanyDatatypes.$fTypeableCompany_ds2 =
  GHC.CString.unpackCString# "Company"

CompanyDatatypes.$fTypeableCompany_wild
  :: Data.Typeable.Internal.TyCon
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 60}]
CompanyDatatypes.$fTypeableCompany_wild =
  Data.Typeable.Internal.TyCon
    (__word64 2504153764752067400)
    (__word64 10373911117495283324)
    CompanyDatatypes.$fTypeableUnit_ds
    CompanyDatatypes.$fTypeableUnit_ds1
    CompanyDatatypes.$fTypeableCompany_ds2

CompanyDatatypes.$fTypeableCompany1
  :: Data.Typeable.Internal.TypeRep
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 50}]
CompanyDatatypes.$fTypeableCompany1 =
  Data.Typeable.Internal.TypeRep
    (__word64 2504153764752067400)
    (__word64 10373911117495283324)
    CompanyDatatypes.$fTypeableCompany_wild
    (GHC.Types.[] @ Data.Typeable.Internal.TypeRep)

CompanyDatatypes.$fTypeableCompany_$ctypeOf
  :: CompanyDatatypes.Company -> Data.Typeable.Internal.TypeRep
[GblId,
 Arity=1,
 Str=DmdType Am,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ _ -> CompanyDatatypes.$fTypeableCompany1}]
CompanyDatatypes.$fTypeableCompany_$ctypeOf =
  \ _ -> CompanyDatatypes.$fTypeableCompany1

CompanyDatatypes.$fTypeableCompany [InlPrag=INLINE (sat-args=0)]
  :: Data.Typeable.Internal.Typeable CompanyDatatypes.Company
[GblId[DFunId(nt)],
 Str=DmdType,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=False,boring_ok=True)
         Tmpl= CompanyDatatypes.$fTypeableCompany_$ctypeOf
               `cast` (Sym
                         <(Data.Typeable.Internal.NTCo:Typeable <CompanyDatatypes.Company>)>
                       :: (CompanyDatatypes.Company -> Data.Typeable.Internal.TypeRep)
                            ~#
                          Data.Typeable.Internal.Typeable CompanyDatatypes.Company)}]
CompanyDatatypes.$fTypeableCompany =
  CompanyDatatypes.$fTypeableCompany_$ctypeOf
  `cast` (Sym
            <(Data.Typeable.Internal.NTCo:Typeable <CompanyDatatypes.Company>)>
          :: (CompanyDatatypes.Company -> Data.Typeable.Internal.TypeRep)
               ~#
             Data.Typeable.Internal.Typeable CompanyDatatypes.Company)

CompanyDatatypes.$fTypeableDept_ds2 :: GHC.Base.String
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 40 0}]
CompanyDatatypes.$fTypeableDept_ds2 =
  GHC.CString.unpackCString# "Dept"

CompanyDatatypes.$fTypeableDept_wild
  :: Data.Typeable.Internal.TyCon
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 60}]
CompanyDatatypes.$fTypeableDept_wild =
  Data.Typeable.Internal.TyCon
    (__word64 5193093341809168841)
    (__word64 7344728000398417852)
    CompanyDatatypes.$fTypeableUnit_ds
    CompanyDatatypes.$fTypeableUnit_ds1
    CompanyDatatypes.$fTypeableDept_ds2

CompanyDatatypes.$fTypeableDept1 :: Data.Typeable.Internal.TypeRep
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 50}]
CompanyDatatypes.$fTypeableDept1 =
  Data.Typeable.Internal.TypeRep
    (__word64 5193093341809168841)
    (__word64 7344728000398417852)
    CompanyDatatypes.$fTypeableDept_wild
    (GHC.Types.[] @ Data.Typeable.Internal.TypeRep)

CompanyDatatypes.$fTypeableDept_$ctypeOf
  :: CompanyDatatypes.Dept -> Data.Typeable.Internal.TypeRep
[GblId,
 Arity=1,
 Str=DmdType Am,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ _ -> CompanyDatatypes.$fTypeableDept1}]
CompanyDatatypes.$fTypeableDept_$ctypeOf =
  \ _ -> CompanyDatatypes.$fTypeableDept1

CompanyDatatypes.$fTypeableDept [InlPrag=INLINE (sat-args=0)]
  :: Data.Typeable.Internal.Typeable CompanyDatatypes.Dept
[GblId[DFunId(nt)],
 Str=DmdType,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=False,boring_ok=True)
         Tmpl= CompanyDatatypes.$fTypeableDept_$ctypeOf
               `cast` (Sym
                         <(Data.Typeable.Internal.NTCo:Typeable <CompanyDatatypes.Dept>)>
                       :: (CompanyDatatypes.Dept -> Data.Typeable.Internal.TypeRep)
                            ~#
                          Data.Typeable.Internal.Typeable CompanyDatatypes.Dept)}]
CompanyDatatypes.$fTypeableDept =
  CompanyDatatypes.$fTypeableDept_$ctypeOf
  `cast` (Sym
            <(Data.Typeable.Internal.NTCo:Typeable <CompanyDatatypes.Dept>)>
          :: (CompanyDatatypes.Dept -> Data.Typeable.Internal.TypeRep)
               ~#
             Data.Typeable.Internal.Typeable CompanyDatatypes.Dept)

CompanyDatatypes.$fTypeableUnit_ds2 :: GHC.Base.String
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 40 0}]
CompanyDatatypes.$fTypeableUnit_ds2 =
  GHC.CString.unpackCString# "Unit"

CompanyDatatypes.$fTypeableUnit_wild
  :: Data.Typeable.Internal.TyCon
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 60}]
CompanyDatatypes.$fTypeableUnit_wild =
  Data.Typeable.Internal.TyCon
    (__word64 16894050643156401805)
    (__word64 6854564727116554803)
    CompanyDatatypes.$fTypeableUnit_ds
    CompanyDatatypes.$fTypeableUnit_ds1
    CompanyDatatypes.$fTypeableUnit_ds2

CompanyDatatypes.$fTypeableUnit1 :: Data.Typeable.Internal.TypeRep
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 50}]
CompanyDatatypes.$fTypeableUnit1 =
  Data.Typeable.Internal.TypeRep
    (__word64 16894050643156401805)
    (__word64 6854564727116554803)
    CompanyDatatypes.$fTypeableUnit_wild
    (GHC.Types.[] @ Data.Typeable.Internal.TypeRep)

CompanyDatatypes.$fTypeableUnit_$ctypeOf
  :: CompanyDatatypes.Unit -> Data.Typeable.Internal.TypeRep
[GblId,
 Arity=1,
 Str=DmdType Am,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ _ -> CompanyDatatypes.$fTypeableUnit1}]
CompanyDatatypes.$fTypeableUnit_$ctypeOf =
  \ _ -> CompanyDatatypes.$fTypeableUnit1

CompanyDatatypes.$fTypeableUnit [InlPrag=INLINE (sat-args=0)]
  :: Data.Typeable.Internal.Typeable CompanyDatatypes.Unit
[GblId[DFunId(nt)],
 Str=DmdType,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=False,boring_ok=True)
         Tmpl= CompanyDatatypes.$fTypeableUnit_$ctypeOf
               `cast` (Sym
                         <(Data.Typeable.Internal.NTCo:Typeable <CompanyDatatypes.Unit>)>
                       :: (CompanyDatatypes.Unit -> Data.Typeable.Internal.TypeRep)
                            ~#
                          Data.Typeable.Internal.Typeable CompanyDatatypes.Unit)}]
CompanyDatatypes.$fTypeableUnit =
  CompanyDatatypes.$fTypeableUnit_$ctypeOf
  `cast` (Sym
            <(Data.Typeable.Internal.NTCo:Typeable <CompanyDatatypes.Unit>)>
          :: (CompanyDatatypes.Unit -> Data.Typeable.Internal.TypeRep)
               ~#
             Data.Typeable.Internal.Typeable CompanyDatatypes.Unit)

CompanyDatatypes.$fTypeableEmployee_ds2 :: GHC.Base.String
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 50 0}]
CompanyDatatypes.$fTypeableEmployee_ds2 =
  GHC.CString.unpackCString# "Employee"

CompanyDatatypes.$fTypeableEmployee_wild
  :: Data.Typeable.Internal.TyCon
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 60}]
CompanyDatatypes.$fTypeableEmployee_wild =
  Data.Typeable.Internal.TyCon
    (__word64 912757362657419687)
    (__word64 13064721439508405479)
    CompanyDatatypes.$fTypeableUnit_ds
    CompanyDatatypes.$fTypeableUnit_ds1
    CompanyDatatypes.$fTypeableEmployee_ds2

CompanyDatatypes.$fTypeableEmployee1
  :: Data.Typeable.Internal.TypeRep
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 50}]
CompanyDatatypes.$fTypeableEmployee1 =
  Data.Typeable.Internal.TypeRep
    (__word64 912757362657419687)
    (__word64 13064721439508405479)
    CompanyDatatypes.$fTypeableEmployee_wild
    (GHC.Types.[] @ Data.Typeable.Internal.TypeRep)

CompanyDatatypes.$fTypeableEmployee_$ctypeOf
  :: CompanyDatatypes.Employee -> Data.Typeable.Internal.TypeRep
[GblId,
 Arity=1,
 Str=DmdType Am,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ _ -> CompanyDatatypes.$fTypeableEmployee1}]
CompanyDatatypes.$fTypeableEmployee_$ctypeOf =
  \ _ -> CompanyDatatypes.$fTypeableEmployee1

CompanyDatatypes.$fTypeableEmployee [InlPrag=INLINE (sat-args=0)]
  :: Data.Typeable.Internal.Typeable CompanyDatatypes.Employee
[GblId[DFunId(nt)],
 Str=DmdType,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=False,boring_ok=True)
         Tmpl= CompanyDatatypes.$fTypeableEmployee_$ctypeOf
               `cast` (Sym
                         <(Data.Typeable.Internal.NTCo:Typeable
                             <CompanyDatatypes.Employee>)>
                       :: (CompanyDatatypes.Employee -> Data.Typeable.Internal.TypeRep)
                            ~#
                          Data.Typeable.Internal.Typeable CompanyDatatypes.Employee)}]
CompanyDatatypes.$fTypeableEmployee =
  CompanyDatatypes.$fTypeableEmployee_$ctypeOf
  `cast` (Sym
            <(Data.Typeable.Internal.NTCo:Typeable
                <CompanyDatatypes.Employee>)>
          :: (CompanyDatatypes.Employee -> Data.Typeable.Internal.TypeRep)
               ~#
             Data.Typeable.Internal.Typeable CompanyDatatypes.Employee)

CompanyDatatypes.$fTypeablePerson_ds2 :: GHC.Base.String
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 50 0}]
CompanyDatatypes.$fTypeablePerson_ds2 =
  GHC.CString.unpackCString# "Person"

CompanyDatatypes.$fTypeablePerson_wild
  :: Data.Typeable.Internal.TyCon
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 60}]
CompanyDatatypes.$fTypeablePerson_wild =
  Data.Typeable.Internal.TyCon
    (__word64 7289977482266162866)
    (__word64 6479209035851230723)
    CompanyDatatypes.$fTypeableUnit_ds
    CompanyDatatypes.$fTypeableUnit_ds1
    CompanyDatatypes.$fTypeablePerson_ds2

CompanyDatatypes.$fTypeablePerson1
  :: Data.Typeable.Internal.TypeRep
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 50}]
CompanyDatatypes.$fTypeablePerson1 =
  Data.Typeable.Internal.TypeRep
    (__word64 7289977482266162866)
    (__word64 6479209035851230723)
    CompanyDatatypes.$fTypeablePerson_wild
    (GHC.Types.[] @ Data.Typeable.Internal.TypeRep)

CompanyDatatypes.$fTypeablePerson_$ctypeOf
  :: CompanyDatatypes.Person -> Data.Typeable.Internal.TypeRep
[GblId,
 Arity=1,
 Str=DmdType Am,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ _ -> CompanyDatatypes.$fTypeablePerson1}]
CompanyDatatypes.$fTypeablePerson_$ctypeOf =
  \ _ -> CompanyDatatypes.$fTypeablePerson1

CompanyDatatypes.$fTypeablePerson [InlPrag=INLINE (sat-args=0)]
  :: Data.Typeable.Internal.Typeable CompanyDatatypes.Person
[GblId[DFunId(nt)],
 Str=DmdType,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=False,boring_ok=True)
         Tmpl= CompanyDatatypes.$fTypeablePerson_$ctypeOf
               `cast` (Sym
                         <(Data.Typeable.Internal.NTCo:Typeable <CompanyDatatypes.Person>)>
                       :: (CompanyDatatypes.Person -> Data.Typeable.Internal.TypeRep)
                            ~#
                          Data.Typeable.Internal.Typeable CompanyDatatypes.Person)}]
CompanyDatatypes.$fTypeablePerson =
  CompanyDatatypes.$fTypeablePerson_$ctypeOf
  `cast` (Sym
            <(Data.Typeable.Internal.NTCo:Typeable <CompanyDatatypes.Person>)>
          :: (CompanyDatatypes.Person -> Data.Typeable.Internal.TypeRep)
               ~#
             Data.Typeable.Internal.Typeable CompanyDatatypes.Person)

CompanyDatatypes.$fDataPerson1
  :: (CompanyDatatypes.Name
      -> CompanyDatatypes.Address -> CompanyDatatypes.Person,
      GHC.Types.Bool)
[GblId,
 Caf=NoCafRefs,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.$fDataPerson1 =
  (CompanyDatatypes.P, GHC.Types.False)

CompanyDatatypes.$w$cgmapMo4
  :: forall (m_aY8 :: * -> *).
     GHC.Base.Monad m_aY8 =>
     (forall a_a1nd. m_aY8 a_a1nd)
     -> (forall a_a1nc. m_aY8 a_a1nc -> m_aY8 a_a1nc -> m_aY8 a_a1nc)
     -> (forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
     -> CompanyDatatypes.Person
     -> m_aY8 CompanyDatatypes.Person
[GblId,
 Arity=5,
 Str=DmdType SLLLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=5, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [20 0 60 60 20] 580 0}]
CompanyDatatypes.$w$cgmapMo4 =
  \ (@ (m_aY8 :: * -> *))
    (ww_s2ep :: GHC.Base.Monad m_aY8)
    (ww1_s2eq :: forall a_a1nd. m_aY8 a_a1nd)
    (ww2_s2er
       :: forall a_a1nc. m_aY8 a_a1nc -> m_aY8 a_a1nc -> m_aY8 a_a1nc)
    (w_s2et
       :: forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
    (w3_s2eu :: CompanyDatatypes.Person) ->
    case ww_s2ep
    of _ { GHC.Base.D:Monad ww3_s2ef ww4_s2eg ww5_s2eh ww6_s2ei ->
    ww3_s2ef
      @ (CompanyDatatypes.Person, GHC.Types.Bool)
      @ CompanyDatatypes.Person
      (case w3_s2eu of _ { CompanyDatatypes.P a22_aSl a23_aSm ->
       let {
         a24_s1JH
           :: forall d_X1xh b_X1xj.
              Data.Data.Data d_X1xh =>
              Data.Data.Mp m_aY8 (d_X1xh -> b_X1xj)
              -> d_X1xh -> m_aY8 (b_X1xj, GHC.Types.Bool)
         [LclId, Arity=3, Str=DmdType LLL]
         a24_s1JH =
           \ (@ d_a1mF)
             (@ b_a1mG)
             ($dData2_a1mH :: Data.Data.Data d_a1mF)
             (ds_a1mI :: Data.Data.Mp m_aY8 (d_a1mF -> b_a1mG))
             (y_a1mJ :: d_a1mF) ->
             let {
               lvl11_s1ER :: m_aY8 d_a1mF
               [LclId, Str=DmdType]
               lvl11_s1ER = w_s2et @ d_a1mF $dData2_a1mH y_a1mJ } in
             ww3_s2ef
               @ (d_a1mF -> b_a1mG, GHC.Types.Bool)
               @ (b_a1mG, GHC.Types.Bool)
               (ds_a1mI
                `cast` (<Data.Data.NTCo:Mp <m_aY8> <d_a1mF -> b_a1mG>>
                        :: Data.Data.Mp m_aY8 (d_a1mF -> b_a1mG)
                             ~#
                           m_aY8 (d_a1mF -> b_a1mG, GHC.Types.Bool)))
               (\ (ds1_a1mK :: (d_a1mF -> b_a1mG, GHC.Types.Bool)) ->
                  case ds1_a1mK of _ { (h_a1mN, b_a1mO) ->
                  case b_a1mO of _ {
                    GHC.Types.False ->
                      ww2_s2er
                        @ (b_a1mG, GHC.Types.Bool)
                        (ww3_s2ef
                           @ d_a1mF
                           @ (b_a1mG, GHC.Types.Bool)
                           lvl11_s1ER
                           (\ (y'_a1mT :: d_a1mF) ->
                              ww5_s2eh
                                @ (b_a1mG, GHC.Types.Bool) (h_a1mN y'_a1mT, GHC.Types.True)))
                        (ww5_s2eh
                           @ (b_a1mG, GHC.Types.Bool) (h_a1mN y_a1mJ, GHC.Types.False));
                    GHC.Types.True ->
                      ww5_s2eh @ (b_a1mG, GHC.Types.Bool) (h_a1mN y_a1mJ, GHC.Types.True)
                  }
                  }) } in
       a24_s1JH
         @ CompanyDatatypes.Address
         @ CompanyDatatypes.Person
         CompanyDatatypes.$fDataPerson_$dData
         ((a24_s1JH
             @ CompanyDatatypes.Name
             @ (CompanyDatatypes.Address -> CompanyDatatypes.Person)
             CompanyDatatypes.$fDataPerson_$dData
             ((ww5_s2eh
                 @ (CompanyDatatypes.Name
                    -> CompanyDatatypes.Address -> CompanyDatatypes.Person,
                    GHC.Types.Bool)
                 CompanyDatatypes.$fDataPerson1)
              `cast` (Sym
                        <(Data.Data.NTCo:Mp
                            <m_aY8>
                            <CompanyDatatypes.Name
                             -> CompanyDatatypes.Address -> CompanyDatatypes.Person>)>
                      :: m_aY8 (CompanyDatatypes.Name
                                -> CompanyDatatypes.Address -> CompanyDatatypes.Person,
                                GHC.Types.Bool)
                           ~#
                         Data.Data.Mp
                           m_aY8
                           (CompanyDatatypes.Name
                            -> CompanyDatatypes.Address -> CompanyDatatypes.Person)))
             a22_aSl)
          `cast` (Sym
                    <(Data.Data.NTCo:Mp
                        <m_aY8> <CompanyDatatypes.Address -> CompanyDatatypes.Person>)>
                  :: m_aY8 (CompanyDatatypes.Address -> CompanyDatatypes.Person,
                            GHC.Types.Bool)
                       ~#
                     Data.Data.Mp
                       m_aY8 (CompanyDatatypes.Address -> CompanyDatatypes.Person)))
         a23_aSm
       })
      (\ (ds_a1n1 :: (CompanyDatatypes.Person, GHC.Types.Bool)) ->
         case ds_a1n1 of _ { (x'_a1n4, b_a1n5) ->
         case b_a1n5 of _ {
           GHC.Types.False -> ww1_s2eq @ CompanyDatatypes.Person;
           GHC.Types.True -> ww5_s2eh @ CompanyDatatypes.Person x'_a1n4
         }
         })
    }

CompanyDatatypes.$fDataPerson_$cgmapMo [InlPrag=INLINE[0]]
  :: forall (m_aY8 :: * -> *).
     Control.Monad.MonadPlus m_aY8 =>
     (forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
     -> CompanyDatatypes.Person -> m_aY8 CompanyDatatypes.Person
[GblId,
 Arity=3,
 Str=DmdType U(SLL)LL,
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapMo4, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (m_aY8 :: * -> *))
                 (w_s2en [Occ=Once!] :: Control.Monad.MonadPlus m_aY8)
                 (w3_s2et [Occ=Once]
                    :: forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
                 (w4_s2eu [Occ=Once] :: CompanyDatatypes.Person) ->
                 case w_s2en
                 of _
                 { Control.Monad.D:MonadPlus ww_s2ep [Occ=Once]
                                             ww1_s2eq [Occ=Once]
                                             ww2_s2er [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapMo4
                   @ m_aY8 ww_s2ep ww1_s2eq ww2_s2er w3_s2et w4_s2eu
                 }}]
CompanyDatatypes.$fDataPerson_$cgmapMo =
  \ (@ (m_aY8 :: * -> *))
    (w_s2en :: Control.Monad.MonadPlus m_aY8)
    (w3_s2et
       :: forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
    (w4_s2eu :: CompanyDatatypes.Person) ->
    case w_s2en
    of _ { Control.Monad.D:MonadPlus ww_s2ep ww1_s2eq ww2_s2er ->
    CompanyDatatypes.$w$cgmapMo4
      @ m_aY8 ww_s2ep ww1_s2eq ww2_s2er w3_s2et w4_s2eu
    }

CompanyDatatypes.$w$cgmapMp2
  :: forall (m_aXe :: * -> *).
     GHC.Base.Monad m_aXe =>
     (forall a_a1nd. m_aXe a_a1nd)
     -> (forall a_a1nc. m_aXe a_a1nc -> m_aXe a_a1nc -> m_aXe a_a1nc)
     -> (forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
     -> CompanyDatatypes.Person
     -> m_aXe CompanyDatatypes.Person
[GblId,
 Arity=5,
 Str=DmdType SLLLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=5, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [20 0 60 60 20] 510 0}]
CompanyDatatypes.$w$cgmapMp2 =
  \ (@ (m_aXe :: * -> *))
    (ww_s2eH :: GHC.Base.Monad m_aXe)
    (ww1_s2eI :: forall a_a1nd. m_aXe a_a1nd)
    (ww2_s2eJ
       :: forall a_a1nc. m_aXe a_a1nc -> m_aXe a_a1nc -> m_aXe a_a1nc)
    (w_s2eL
       :: forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
    (w3_s2eM :: CompanyDatatypes.Person) ->
    case ww_s2eH
    of _ { GHC.Base.D:Monad ww3_s2ex ww4_s2ey ww5_s2ez ww6_s2eA ->
    ww3_s2ex
      @ (CompanyDatatypes.Person, GHC.Types.Bool)
      @ CompanyDatatypes.Person
      (case w3_s2eM of _ { CompanyDatatypes.P a22_aSl a23_aSm ->
       let {
         a24_s1JN
           :: forall d_X1ye b_X1yg.
              Data.Data.Data d_X1ye =>
              Data.Data.Mp m_aXe (d_X1ye -> b_X1yg)
              -> d_X1ye -> m_aXe (b_X1yg, GHC.Types.Bool)
         [LclId, Arity=3, Str=DmdType LLL]
         a24_s1JN =
           \ (@ d_a1nA)
             (@ b_a1nB)
             ($dData2_a1nC :: Data.Data.Data d_a1nA)
             (ds_a1nD :: Data.Data.Mp m_aXe (d_a1nA -> b_a1nB))
             (y_a1nE :: d_a1nA) ->
             let {
               lvl11_s1ET [Dmd=Just L] :: m_aXe d_a1nA
               [LclId, Str=DmdType]
               lvl11_s1ET = w_s2eL @ d_a1nA $dData2_a1nC y_a1nE } in
             ww3_s2ex
               @ (d_a1nA -> b_a1nB, GHC.Types.Bool)
               @ (b_a1nB, GHC.Types.Bool)
               (ds_a1nD
                `cast` (<Data.Data.NTCo:Mp <m_aXe> <d_a1nA -> b_a1nB>>
                        :: Data.Data.Mp m_aXe (d_a1nA -> b_a1nB)
                             ~#
                           m_aXe (d_a1nA -> b_a1nB, GHC.Types.Bool)))
               (\ (ds1_a1nF :: (d_a1nA -> b_a1nB, GHC.Types.Bool)) ->
                  case ds1_a1nF of _ { (h_a1nI, b_a1nJ) ->
                  ww2_s2eJ
                    @ (b_a1nB, GHC.Types.Bool)
                    (ww3_s2ex
                       @ d_a1nA
                       @ (b_a1nB, GHC.Types.Bool)
                       lvl11_s1ET
                       (\ (y'_a1nL :: d_a1nA) ->
                          ww5_s2ez
                            @ (b_a1nB, GHC.Types.Bool) (h_a1nI y'_a1nL, GHC.Types.True)))
                    (ww5_s2ez @ (b_a1nB, GHC.Types.Bool) (h_a1nI y_a1nE, b_a1nJ))
                  }) } in
       a24_s1JN
         @ CompanyDatatypes.Address
         @ CompanyDatatypes.Person
         CompanyDatatypes.$fDataPerson_$dData
         ((a24_s1JN
             @ CompanyDatatypes.Name
             @ (CompanyDatatypes.Address -> CompanyDatatypes.Person)
             CompanyDatatypes.$fDataPerson_$dData
             ((ww5_s2ez
                 @ (CompanyDatatypes.Name
                    -> CompanyDatatypes.Address -> CompanyDatatypes.Person,
                    GHC.Types.Bool)
                 CompanyDatatypes.$fDataPerson1)
              `cast` (Sym
                        <(Data.Data.NTCo:Mp
                            <m_aXe>
                            <CompanyDatatypes.Name
                             -> CompanyDatatypes.Address -> CompanyDatatypes.Person>)>
                      :: m_aXe (CompanyDatatypes.Name
                                -> CompanyDatatypes.Address -> CompanyDatatypes.Person,
                                GHC.Types.Bool)
                           ~#
                         Data.Data.Mp
                           m_aXe
                           (CompanyDatatypes.Name
                            -> CompanyDatatypes.Address -> CompanyDatatypes.Person)))
             a22_aSl)
          `cast` (Sym
                    <(Data.Data.NTCo:Mp
                        <m_aXe> <CompanyDatatypes.Address -> CompanyDatatypes.Person>)>
                  :: m_aXe (CompanyDatatypes.Address -> CompanyDatatypes.Person,
                            GHC.Types.Bool)
                       ~#
                     Data.Data.Mp
                       m_aXe (CompanyDatatypes.Address -> CompanyDatatypes.Person)))
         a23_aSm
       })
      (\ (ds_a1nR :: (CompanyDatatypes.Person, GHC.Types.Bool)) ->
         case ds_a1nR of _ { (x'_a1nU, b_a1nV) ->
         case b_a1nV of _ {
           GHC.Types.False -> ww1_s2eI @ CompanyDatatypes.Person;
           GHC.Types.True -> ww5_s2ez @ CompanyDatatypes.Person x'_a1nU
         }
         })
    }

CompanyDatatypes.$fDataPerson_$cgmapMp [InlPrag=INLINE[0]]
  :: forall (m_aXe :: * -> *).
     Control.Monad.MonadPlus m_aXe =>
     (forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
     -> CompanyDatatypes.Person -> m_aXe CompanyDatatypes.Person
[GblId,
 Arity=3,
 Str=DmdType U(SLL)LL,
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapMp2, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (m_aXe :: * -> *))
                 (w_s2eF [Occ=Once!] :: Control.Monad.MonadPlus m_aXe)
                 (w3_s2eL [Occ=Once]
                    :: forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
                 (w4_s2eM [Occ=Once] :: CompanyDatatypes.Person) ->
                 case w_s2eF
                 of _
                 { Control.Monad.D:MonadPlus ww_s2eH [Occ=Once]
                                             ww1_s2eI [Occ=Once]
                                             ww2_s2eJ [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapMp2
                   @ m_aXe ww_s2eH ww1_s2eI ww2_s2eJ w3_s2eL w4_s2eM
                 }}]
CompanyDatatypes.$fDataPerson_$cgmapMp =
  \ (@ (m_aXe :: * -> *))
    (w_s2eF :: Control.Monad.MonadPlus m_aXe)
    (w3_s2eL
       :: forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
    (w4_s2eM :: CompanyDatatypes.Person) ->
    case w_s2eF
    of _ { Control.Monad.D:MonadPlus ww_s2eH ww1_s2eI ww2_s2eJ ->
    CompanyDatatypes.$w$cgmapMp2
      @ m_aXe ww_s2eH ww1_s2eI ww2_s2eJ w3_s2eL w4_s2eM
    }

CompanyDatatypes.$w$cgmapM2
  :: forall (m_aX4 :: * -> *).
     (forall a_a1ne b_a1nf.
      m_aX4 a_a1ne -> (a_a1ne -> m_aX4 b_a1nf) -> m_aX4 b_a1nf)
     -> (forall a_a1ni. a_a1ni -> m_aX4 a_a1ni)
     -> (forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
     -> CompanyDatatypes.Name
     -> CompanyDatatypes.Address
     -> m_aX4 CompanyDatatypes.Person
[GblId,
 Arity=5,
 Str=DmdType SLLLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=5, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [120 120 60 0 0] 300 0}]
CompanyDatatypes.$w$cgmapM2 =
  \ (@ (m_aX4 :: * -> *))
    (ww_s2eT
       :: forall a_a1ne b_a1nf.
          m_aX4 a_a1ne -> (a_a1ne -> m_aX4 b_a1nf) -> m_aX4 b_a1nf)
    (ww1_s2eV :: forall a_a1ni. a_a1ni -> m_aX4 a_a1ni)
    (w_s2eY
       :: forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
    (ww2_s2f1 :: CompanyDatatypes.Name)
    (ww3_s2f2 :: CompanyDatatypes.Address) ->
    let {
      k_XWA
        :: forall d_aV1 b_aV2.
           Data.Data.Data d_aV1 =>
           m_aX4 (d_aV1 -> b_aV2) -> d_aV1 -> m_aX4 b_aV2
      [LclId, Arity=3, Str=DmdType LLL]
      k_XWA =
        \ (@ d_a1ob)
          (@ b_a1oc)
          ($dData2_a1od :: Data.Data.Data d_a1ob)
          (c_a1oe :: m_aX4 (d_a1ob -> b_a1oc))
          (x_a1of :: d_a1ob) ->
          let {
            lvl11_s1EU [Dmd=Just L] :: m_aX4 d_a1ob
            [LclId, Str=DmdType]
            lvl11_s1EU = w_s2eY @ d_a1ob $dData2_a1od x_a1of } in
          ww_s2eT
            @ (d_a1ob -> b_a1oc)
            @ b_a1oc
            c_a1oe
            (\ (c'_a1og :: d_a1ob -> b_a1oc) ->
               ww_s2eT
                 @ d_a1ob
                 @ b_a1oc
                 lvl11_s1EU
                 (\ (x'_a1oh :: d_a1ob) ->
                    ww1_s2eV @ b_a1oc (c'_a1og x'_a1oh))) } in
    k_XWA
      @ CompanyDatatypes.Address
      @ CompanyDatatypes.Person
      CompanyDatatypes.$fDataPerson_$dData
      (k_XWA
         @ CompanyDatatypes.Name
         @ (CompanyDatatypes.Address -> CompanyDatatypes.Person)
         CompanyDatatypes.$fDataPerson_$dData
         (ww1_s2eV
            @ (CompanyDatatypes.Name
               -> CompanyDatatypes.Address -> CompanyDatatypes.Person)
            CompanyDatatypes.P)
         ww2_s2f1)
      ww3_s2f2

CompanyDatatypes.$fDataPerson_$cgmapM [InlPrag=INLINE[0]]
  :: forall (m_aX4 :: * -> *).
     GHC.Base.Monad m_aX4 =>
     (forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
     -> CompanyDatatypes.Person -> m_aX4 CompanyDatatypes.Person
[GblId,
 Arity=3,
 Str=DmdType U(SALA)LU(LL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapM2, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (m_aX4 :: * -> *))
                 (w_s2eR [Occ=Once!] :: GHC.Base.Monad m_aX4)
                 (w3_s2eY [Occ=Once]
                    :: forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
                 (w4_s2eZ [Occ=Once!] :: CompanyDatatypes.Person) ->
                 case w_s2eR
                 of _
                 { GHC.Base.D:Monad ww_s2eT [Occ=Once] _ ww2_s2eV [Occ=Once] _ ->
                 case w4_s2eZ
                 of _
                 { CompanyDatatypes.P ww4_s2f1 [Occ=Once] ww5_s2f2 [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapM2
                   @ m_aX4 ww_s2eT ww2_s2eV w3_s2eY ww4_s2f1 ww5_s2f2
                 }
                 }}]
CompanyDatatypes.$fDataPerson_$cgmapM =
  \ (@ (m_aX4 :: * -> *))
    (w_s2eR :: GHC.Base.Monad m_aX4)
    (w3_s2eY
       :: forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
    (w4_s2eZ :: CompanyDatatypes.Person) ->
    case w_s2eR
    of _ { GHC.Base.D:Monad ww_s2eT ww1_s2eU ww2_s2eV ww3_s2eW ->
    case w4_s2eZ of _ { CompanyDatatypes.P ww4_s2f1 ww5_s2f2 ->
    CompanyDatatypes.$w$cgmapM2
      @ m_aX4 ww_s2eT ww2_s2eV w3_s2eY ww4_s2f1 ww5_s2f2
    }
    }

CompanyDatatypes.$w$cgmapQi1
  :: forall u_aWW.
     GHC.Prim.Int#
     -> (forall d_aWX. Data.Data.Data d_aWX => d_aWX -> u_aWW)
     -> CompanyDatatypes.Name
     -> CompanyDatatypes.Address
     -> u_aWW
[GblId,
 Arity=4,
 Str=DmdType LC(C(S))LL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=4, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [70 120 0 0] 90 0}]
CompanyDatatypes.$w$cgmapQi1 =
  \ (@ u_aWW)
    (ww_s2fa :: GHC.Prim.Int#)
    (w_s2fc :: forall d_aWX. Data.Data.Data d_aWX => d_aWX -> u_aWW)
    (ww1_s2ff :: CompanyDatatypes.Name)
    (ww2_s2fg :: CompanyDatatypes.Address) ->
    case ww_s2fa of _ {
      __DEFAULT -> Data.Maybe.fromJust1 @ u_aWW;
      0 ->
        w_s2fc
          @ CompanyDatatypes.Name
          CompanyDatatypes.$fDataPerson_$dData
          ww1_s2ff;
      1 ->
        w_s2fc
          @ CompanyDatatypes.Address
          CompanyDatatypes.$fDataPerson_$dData
          ww2_s2fg
    }

CompanyDatatypes.$fDataPerson_$cgmapQi [InlPrag=INLINE[0]]
  :: forall u_aWW.
     GHC.Types.Int
     -> (forall d_aWX. Data.Data.Data d_aWX => d_aWX -> u_aWW)
     -> CompanyDatatypes.Person
     -> u_aWW
[GblId,
 Arity=3,
 Str=DmdType U(L)C(C(S))U(LL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapQi1, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ u_aWW)
                 (w_s2f8 [Occ=Once!] :: GHC.Types.Int)
                 (w3_s2fc [Occ=Once]
                    :: forall d_aWX. Data.Data.Data d_aWX => d_aWX -> u_aWW)
                 (w4_s2fd [Occ=Once!] :: CompanyDatatypes.Person) ->
                 case w_s2f8 of _ { GHC.Types.I# ww_s2fa [Occ=Once] ->
                 case w4_s2fd
                 of _
                 { CompanyDatatypes.P ww1_s2ff [Occ=Once] ww2_s2fg [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapQi1
                   @ u_aWW ww_s2fa w3_s2fc ww1_s2ff ww2_s2fg
                 }
                 }}]
CompanyDatatypes.$fDataPerson_$cgmapQi =
  \ (@ u_aWW)
    (w_s2f8 :: GHC.Types.Int)
    (w3_s2fc :: forall d_aWX. Data.Data.Data d_aWX => d_aWX -> u_aWW)
    (w4_s2fd :: CompanyDatatypes.Person) ->
    case w_s2f8 of _ { GHC.Types.I# ww_s2fa ->
    case w4_s2fd of _ { CompanyDatatypes.P ww1_s2ff ww2_s2fg ->
    CompanyDatatypes.$w$cgmapQi1
      @ u_aWW ww_s2fa w3_s2fc ww1_s2ff ww2_s2fg
    }
    }

CompanyDatatypes.$w$cgmapQr1
  :: forall r_aWE r'_aWF.
     (r'_aWF -> r_aWE -> r_aWE)
     -> r_aWE
     -> (forall d_aWG. Data.Data.Data d_aWG => d_aWG -> r'_aWF)
     -> CompanyDatatypes.Name
     -> CompanyDatatypes.Address
     -> r_aWE
[GblId,
 Arity=5,
 Str=DmdType C(C(S))LLLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=5, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [60 0 120 0 0] 120 0}]
CompanyDatatypes.$w$cgmapQr1 =
  \ (@ r_aWE)
    (@ r'_aWF)
    (w_s2fn :: r'_aWF -> r_aWE -> r_aWE)
    (w3_s2fo :: r_aWE)
    (w4_s2fp :: forall d_aWG. Data.Data.Data d_aWG => d_aWG -> r'_aWF)
    (ww_s2fs :: CompanyDatatypes.Name)
    (ww1_s2ft :: CompanyDatatypes.Address) ->
    w_s2fn
      (w4_s2fp
         @ CompanyDatatypes.Name
         CompanyDatatypes.$fDataPerson_$dData
         ww_s2fs)
      (w_s2fn
         (w4_s2fp
            @ CompanyDatatypes.Address
            CompanyDatatypes.$fDataPerson_$dData
            ww1_s2ft)
         w3_s2fo)

CompanyDatatypes.$fDataPerson_$cgmapQr [InlPrag=INLINE[0]]
  :: forall r_aWE r'_aWF.
     (r'_aWF -> r_aWE -> r_aWE)
     -> r_aWE
     -> (forall d_aWG. Data.Data.Data d_aWG => d_aWG -> r'_aWF)
     -> CompanyDatatypes.Person
     -> r_aWE
[GblId,
 Arity=4,
 Str=DmdType C(C(S))LLU(LL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapQr1, TopLvl=True,
         Arity=4, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ r_aWE)
                 (@ r'_aWF)
                 (w_s2fn [Occ=Once] :: r'_aWF -> r_aWE -> r_aWE)
                 (w3_s2fo [Occ=Once] :: r_aWE)
                 (w4_s2fp [Occ=Once]
                    :: forall d_aWG. Data.Data.Data d_aWG => d_aWG -> r'_aWF)
                 (w5_s2fq [Occ=Once!] :: CompanyDatatypes.Person) ->
                 case w5_s2fq
                 of _ { CompanyDatatypes.P ww_s2fs [Occ=Once] ww1_s2ft [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapQr1
                   @ r_aWE @ r'_aWF w_s2fn w3_s2fo w4_s2fp ww_s2fs ww1_s2ft
                 }}]
CompanyDatatypes.$fDataPerson_$cgmapQr =
  \ (@ r_aWE)
    (@ r'_aWF)
    (w_s2fn :: r'_aWF -> r_aWE -> r_aWE)
    (w3_s2fo :: r_aWE)
    (w4_s2fp :: forall d_aWG. Data.Data.Data d_aWG => d_aWG -> r'_aWF)
    (w5_s2fq :: CompanyDatatypes.Person) ->
    case w5_s2fq of _ { CompanyDatatypes.P ww_s2fs ww1_s2ft ->
    CompanyDatatypes.$w$cgmapQr1
      @ r_aWE @ r'_aWF w_s2fn w3_s2fo w4_s2fp ww_s2fs ww1_s2ft
    }

CompanyDatatypes.$fDataPerson_$cgmapQ
  :: forall u_aWO.
     (forall d_aWP. Data.Data.Data d_aWP => d_aWP -> u_aWO)
     -> CompanyDatatypes.Person -> [u_aWO]
[GblId,
 Arity=2,
 Str=DmdType LU(LL),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ u_a1pL)
                 (f_a1pM
                    :: forall d_a1pN. Data.Data.Data d_a1pN => d_a1pN -> u_a1pL)
                 (eta_B1 [Occ=Once!] :: CompanyDatatypes.Person) ->
                 case eta_B1
                 of _ { CompanyDatatypes.P a22_aSl [Occ=Once] a23_aSm [Occ=Once] ->
                 GHC.Types.:
                   @ u_a1pL
                   (f_a1pM
                      @ CompanyDatatypes.Name
                      CompanyDatatypes.$fDataPerson_$dData
                      a22_aSl)
                   (GHC.Types.:
                      @ u_a1pL
                      (f_a1pM
                         @ CompanyDatatypes.Address
                         CompanyDatatypes.$fDataPerson_$dData
                         a23_aSm)
                      (GHC.Types.[] @ u_a1pL))
                 }}]
CompanyDatatypes.$fDataPerson_$cgmapQ =
  \ (@ u_a1pL)
    (f_a1pM
       :: forall d_a1pN. Data.Data.Data d_a1pN => d_a1pN -> u_a1pL)
    (eta_B1 :: CompanyDatatypes.Person) ->
    case eta_B1 of _ { CompanyDatatypes.P a22_aSl a23_aSm ->
    GHC.Types.:
      @ u_a1pL
      (f_a1pM
         @ CompanyDatatypes.Name
         CompanyDatatypes.$fDataPerson_$dData
         a22_aSl)
      (GHC.Types.:
         @ u_a1pL
         (f_a1pM
            @ CompanyDatatypes.Address
            CompanyDatatypes.$fDataPerson_$dData
            a23_aSm)
         (GHC.Types.[] @ u_a1pL))
    }

CompanyDatatypes.$w$cgmapQl1
  :: forall r_aWu r'_aWv.
     (r_aWu -> r'_aWv -> r_aWu)
     -> r_aWu
     -> (forall d_aWw. Data.Data.Data d_aWw => d_aWw -> r'_aWv)
     -> CompanyDatatypes.Name
     -> CompanyDatatypes.Address
     -> r_aWu
[GblId,
 Arity=5,
 Str=DmdType C(C(S))LLLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=5, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [60 0 120 0 0] 120 0}]
CompanyDatatypes.$w$cgmapQl1 =
  \ (@ r_aWu)
    (@ r'_aWv)
    (w_s2fA :: r_aWu -> r'_aWv -> r_aWu)
    (w3_s2fB :: r_aWu)
    (w4_s2fC :: forall d_aWw. Data.Data.Data d_aWw => d_aWw -> r'_aWv)
    (ww_s2fF :: CompanyDatatypes.Name)
    (ww1_s2fG :: CompanyDatatypes.Address) ->
    w_s2fA
      (w_s2fA
         w3_s2fB
         (w4_s2fC
            @ CompanyDatatypes.Name
            CompanyDatatypes.$fDataPerson_$dData
            ww_s2fF))
      (w4_s2fC
         @ CompanyDatatypes.Address
         CompanyDatatypes.$fDataPerson_$dData
         ww1_s2fG)

CompanyDatatypes.$fDataPerson_$cgmapQl [InlPrag=INLINE[0]]
  :: forall r_aWu r'_aWv.
     (r_aWu -> r'_aWv -> r_aWu)
     -> r_aWu
     -> (forall d_aWw. Data.Data.Data d_aWw => d_aWw -> r'_aWv)
     -> CompanyDatatypes.Person
     -> r_aWu
[GblId,
 Arity=4,
 Str=DmdType C(C(S))LLU(LL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapQl1, TopLvl=True,
         Arity=4, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ r_aWu)
                 (@ r'_aWv)
                 (w_s2fA [Occ=Once] :: r_aWu -> r'_aWv -> r_aWu)
                 (w3_s2fB [Occ=Once] :: r_aWu)
                 (w4_s2fC [Occ=Once]
                    :: forall d_aWw. Data.Data.Data d_aWw => d_aWw -> r'_aWv)
                 (w5_s2fD [Occ=Once!] :: CompanyDatatypes.Person) ->
                 case w5_s2fD
                 of _ { CompanyDatatypes.P ww_s2fF [Occ=Once] ww1_s2fG [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapQl1
                   @ r_aWu @ r'_aWv w_s2fA w3_s2fB w4_s2fC ww_s2fF ww1_s2fG
                 }}]
CompanyDatatypes.$fDataPerson_$cgmapQl =
  \ (@ r_aWu)
    (@ r'_aWv)
    (w_s2fA :: r_aWu -> r'_aWv -> r_aWu)
    (w3_s2fB :: r_aWu)
    (w4_s2fC :: forall d_aWw. Data.Data.Data d_aWw => d_aWw -> r'_aWv)
    (w5_s2fD :: CompanyDatatypes.Person) ->
    case w5_s2fD of _ { CompanyDatatypes.P ww_s2fF ww1_s2fG ->
    CompanyDatatypes.$w$cgmapQl1
      @ r_aWu @ r'_aWv w_s2fA w3_s2fB w4_s2fC ww_s2fF ww1_s2fG
    }

CompanyDatatypes.$fDataPerson_$cgmapT
  :: (forall b_aWo. Data.Data.Data b_aWo => b_aWo -> b_aWo)
     -> CompanyDatatypes.Person -> CompanyDatatypes.Person
[GblId,
 Arity=2,
 Str=DmdType LU(LL)m,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (f_a1r7
                    :: forall b_a1r8. Data.Data.Data b_a1r8 => b_a1r8 -> b_a1r8)
                 (x0_a1r9 [Occ=Once!] :: CompanyDatatypes.Person) ->
                 case x0_a1r9
                 of _ { CompanyDatatypes.P a22_aSl [Occ=Once] a23_aSm [Occ=Once] ->
                 CompanyDatatypes.P
                   (f_a1r7
                      @ CompanyDatatypes.Name
                      CompanyDatatypes.$fDataPerson_$dData
                      a22_aSl)
                   (f_a1r7
                      @ CompanyDatatypes.Address
                      CompanyDatatypes.$fDataPerson_$dData
                      a23_aSm)
                 }}]
CompanyDatatypes.$fDataPerson_$cgmapT =
  \ (f_a1r7
       :: forall b_a1r8. Data.Data.Data b_a1r8 => b_a1r8 -> b_a1r8)
    (x0_a1r9 :: CompanyDatatypes.Person) ->
    case x0_a1r9 of _ { CompanyDatatypes.P a22_aSl a23_aSm ->
    CompanyDatatypes.P
      (f_a1r7
         @ CompanyDatatypes.Name
         CompanyDatatypes.$fDataPerson_$dData
         a22_aSl)
      (f_a1r7
         @ CompanyDatatypes.Address
         CompanyDatatypes.$fDataPerson_$dData
         a23_aSm)
    }

CompanyDatatypes.$fDataPerson_$cdataCast2
  :: forall (c_aWc :: * -> *) (t_aWd :: * -> * -> *).
     Data.Typeable.Internal.Typeable2 t_aWd =>
     (forall d_aWe e_aWf.
      (Data.Data.Data d_aWe, Data.Data.Data e_aWf) =>
      c_aWc (t_aWd d_aWe e_aWf))
     -> Data.Maybe.Maybe (c_aWc CompanyDatatypes.Person)
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType AA,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ (@ (c_a1rt :: * -> *)) (@ (t_a1ru :: * -> * -> *)) _ _ ->
                 Data.Maybe.Nothing @ (c_a1rt CompanyDatatypes.Person)}]
CompanyDatatypes.$fDataPerson_$cdataCast2 =
  \ (@ (c_a1rt :: * -> *)) (@ (t_a1ru :: * -> * -> *)) _ _ ->
    Data.Maybe.Nothing @ (c_a1rt CompanyDatatypes.Person)

CompanyDatatypes.$fDataPerson_$cdataCast1
  :: forall (c_aVp :: * -> *) (t_aVq :: * -> *).
     Data.Typeable.Internal.Typeable1 t_aVq =>
     (forall d_aVr. Data.Data.Data d_aVr => c_aVp (t_aVq d_aVr))
     -> Data.Maybe.Maybe (c_aVp CompanyDatatypes.Person)
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType AA,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ (@ (c_a1rB :: * -> *)) (@ (t_a1rC :: * -> *)) _ _ ->
                 Data.Maybe.Nothing @ (c_a1rB CompanyDatatypes.Person)}]
CompanyDatatypes.$fDataPerson_$cdataCast1 =
  \ (@ (c_a1rB :: * -> *)) (@ (t_a1rC :: * -> *)) _ _ ->
    Data.Maybe.Nothing @ (c_a1rB CompanyDatatypes.Person)

CompanyDatatypes.$fDataPerson [InlPrag=[ALWAYS] CONLIKE]
  :: Data.Data.Data CompanyDatatypes.Person
[GblId[DFunId],
 Str=DmdType,
 Unf=DFun(arity=0) Data.Data.D:Data [{CompanyDatatypes.$fTypeablePerson},
                                     {CompanyDatatypes.$fDataPerson_$cgfoldl},
                                     {CompanyDatatypes.$fDataPerson_$cgunfold},
                                     {CompanyDatatypes.$fDataPerson_$ctoConstr},
                                     {CompanyDatatypes.$fDataPerson_$cdataTypeOf},
                                     {CompanyDatatypes.$fDataPerson_$cdataCast1},
                                     {CompanyDatatypes.$fDataPerson_$cdataCast2},
                                     {CompanyDatatypes.$fDataPerson_$cgmapT},
                                     {CompanyDatatypes.$fDataPerson_$cgmapQl},
                                     {CompanyDatatypes.$fDataPerson_$cgmapQr},
                                     {CompanyDatatypes.$fDataPerson_$cgmapQ},
                                     {CompanyDatatypes.$fDataPerson_$cgmapQi},
                                     {CompanyDatatypes.$fDataPerson_$cgmapM},
                                     {CompanyDatatypes.$fDataPerson_$cgmapMp},
                                     {CompanyDatatypes.$fDataPerson_$cgmapMo}]]
CompanyDatatypes.$fDataPerson =
  Data.Data.D:Data
    @ CompanyDatatypes.Person
    (CompanyDatatypes.$fTypeablePerson_$ctypeOf
     `cast` (Sym
               <(Data.Typeable.Internal.NTCo:Typeable <CompanyDatatypes.Person>)>
             :: (CompanyDatatypes.Person -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable CompanyDatatypes.Person))
    CompanyDatatypes.$fDataPerson_$cgfoldl
    CompanyDatatypes.$fDataPerson_$cgunfold
    CompanyDatatypes.$fDataPerson_$ctoConstr
    CompanyDatatypes.$fDataPerson_$cdataTypeOf
    CompanyDatatypes.$fDataPerson_$cdataCast1
    CompanyDatatypes.$fDataPerson_$cdataCast2
    CompanyDatatypes.$fDataPerson_$cgmapT
    CompanyDatatypes.$fDataPerson_$cgmapQl
    CompanyDatatypes.$fDataPerson_$cgmapQr
    CompanyDatatypes.$fDataPerson_$cgmapQ
    CompanyDatatypes.$fDataPerson_$cgmapQi
    CompanyDatatypes.$fDataPerson_$cgmapM
    CompanyDatatypes.$fDataPerson_$cgmapMp
    CompanyDatatypes.$fDataPerson_$cgmapMo

CompanyDatatypes.$fTypeableSalary_ds2 :: GHC.Base.String
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=False,
         Guidance=IF_ARGS [] 50 0}]
CompanyDatatypes.$fTypeableSalary_ds2 =
  GHC.CString.unpackCString# "Salary"

CompanyDatatypes.$fTypeableSalary_wild
  :: Data.Typeable.Internal.TyCon
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 60}]
CompanyDatatypes.$fTypeableSalary_wild =
  Data.Typeable.Internal.TyCon
    (__word64 1667096353067349412)
    (__word64 757304047316444936)
    CompanyDatatypes.$fTypeableUnit_ds
    CompanyDatatypes.$fTypeableUnit_ds1
    CompanyDatatypes.$fTypeableSalary_ds2

CompanyDatatypes.$fTypeableSalary1
  :: Data.Typeable.Internal.TypeRep
[GblId,
 Str=DmdType m,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 50}]
CompanyDatatypes.$fTypeableSalary1 =
  Data.Typeable.Internal.TypeRep
    (__word64 1667096353067349412)
    (__word64 757304047316444936)
    CompanyDatatypes.$fTypeableSalary_wild
    (GHC.Types.[] @ Data.Typeable.Internal.TypeRep)

CompanyDatatypes.$fTypeableSalary_$ctypeOf
  :: CompanyDatatypes.Salary -> Data.Typeable.Internal.TypeRep
[GblId,
 Arity=1,
 Str=DmdType Am,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=1, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ _ -> CompanyDatatypes.$fTypeableSalary1}]
CompanyDatatypes.$fTypeableSalary_$ctypeOf =
  \ _ -> CompanyDatatypes.$fTypeableSalary1

CompanyDatatypes.$fTypeableSalary [InlPrag=INLINE (sat-args=0)]
  :: Data.Typeable.Internal.Typeable CompanyDatatypes.Salary
[GblId[DFunId(nt)],
 Str=DmdType,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=False,boring_ok=True)
         Tmpl= CompanyDatatypes.$fTypeableSalary_$ctypeOf
               `cast` (Sym
                         <(Data.Typeable.Internal.NTCo:Typeable <CompanyDatatypes.Salary>)>
                       :: (CompanyDatatypes.Salary -> Data.Typeable.Internal.TypeRep)
                            ~#
                          Data.Typeable.Internal.Typeable CompanyDatatypes.Salary)}]
CompanyDatatypes.$fTypeableSalary =
  CompanyDatatypes.$fTypeableSalary_$ctypeOf
  `cast` (Sym
            <(Data.Typeable.Internal.NTCo:Typeable <CompanyDatatypes.Salary>)>
          :: (CompanyDatatypes.Salary -> Data.Typeable.Internal.TypeRep)
               ~#
             Data.Typeable.Internal.Typeable CompanyDatatypes.Salary)

CompanyDatatypes.$fDataSalary1
  :: (GHC.Types.Float -> CompanyDatatypes.Salary, GHC.Types.Bool)
[GblId,
 Caf=NoCafRefs,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.$fDataSalary1 =
  (CompanyDatatypes.S, GHC.Types.False)

CompanyDatatypes.$w$cgmapMo5
  :: forall (m_aY8 :: * -> *).
     GHC.Base.Monad m_aY8 =>
     (forall a_a1nd. m_aY8 a_a1nd)
     -> (forall a_a1nc. m_aY8 a_a1nc -> m_aY8 a_a1nc -> m_aY8 a_a1nc)
     -> (forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
     -> CompanyDatatypes.Salary
     -> m_aY8 CompanyDatatypes.Salary
[GblId,
 Arity=5,
 Str=DmdType SLLLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=5, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [20 0 60 60 20] 460 0}]
CompanyDatatypes.$w$cgmapMo5 =
  \ (@ (m_aY8 :: * -> *))
    (ww_s2fU :: GHC.Base.Monad m_aY8)
    (ww1_s2fV :: forall a_a1nd. m_aY8 a_a1nd)
    (ww2_s2fW
       :: forall a_a1nc. m_aY8 a_a1nc -> m_aY8 a_a1nc -> m_aY8 a_a1nc)
    (w_s2fY
       :: forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
    (w3_s2fZ :: CompanyDatatypes.Salary) ->
    case ww_s2fU
    of _ { GHC.Base.D:Monad ww3_s2fK ww4_s2fL ww5_s2fM ww6_s2fN ->
    ww3_s2fK
      @ (CompanyDatatypes.Salary, GHC.Types.Bool)
      @ CompanyDatatypes.Salary
      (case w3_s2fZ of _ { CompanyDatatypes.S a22_aS7 ->
       let {
         lvl11_s1Fa :: m_aY8 GHC.Types.Float
         [LclId, Str=DmdType]
         lvl11_s1Fa =
           w_s2fY @ GHC.Types.Float Data.Data.$fDataFloat a22_aS7 } in
       ww3_s2fK
         @ (GHC.Types.Float -> CompanyDatatypes.Salary, GHC.Types.Bool)
         @ (CompanyDatatypes.Salary, GHC.Types.Bool)
         (ww5_s2fM
            @ (GHC.Types.Float -> CompanyDatatypes.Salary, GHC.Types.Bool)
            CompanyDatatypes.$fDataSalary1)
         (\ (ds1_a1mK
               :: (GHC.Types.Float -> CompanyDatatypes.Salary, GHC.Types.Bool)) ->
            case ds1_a1mK of _ { (h_a1mN, b_a1mO) ->
            case b_a1mO of _ {
              GHC.Types.False ->
                ww2_s2fW
                  @ (CompanyDatatypes.Salary, GHC.Types.Bool)
                  (ww3_s2fK
                     @ GHC.Types.Float
                     @ (CompanyDatatypes.Salary, GHC.Types.Bool)
                     lvl11_s1Fa
                     (\ (y'_a1mT :: GHC.Types.Float) ->
                        ww5_s2fM
                          @ (CompanyDatatypes.Salary, GHC.Types.Bool)
                          (h_a1mN y'_a1mT, GHC.Types.True)))
                  (ww5_s2fM
                     @ (CompanyDatatypes.Salary, GHC.Types.Bool)
                     (h_a1mN a22_aS7, GHC.Types.False));
              GHC.Types.True ->
                ww5_s2fM
                  @ (CompanyDatatypes.Salary, GHC.Types.Bool)
                  (h_a1mN a22_aS7, GHC.Types.True)
            }
            })
       })
      (\ (ds_a1n1 :: (CompanyDatatypes.Salary, GHC.Types.Bool)) ->
         case ds_a1n1 of _ { (x'_a1n4, b_a1n5) ->
         case b_a1n5 of _ {
           GHC.Types.False -> ww1_s2fV @ CompanyDatatypes.Salary;
           GHC.Types.True -> ww5_s2fM @ CompanyDatatypes.Salary x'_a1n4
         }
         })
    }

CompanyDatatypes.$fDataSalary_$cgmapMo [InlPrag=INLINE[0]]
  :: forall (m_aY8 :: * -> *).
     Control.Monad.MonadPlus m_aY8 =>
     (forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
     -> CompanyDatatypes.Salary -> m_aY8 CompanyDatatypes.Salary
[GblId,
 Arity=3,
 Str=DmdType U(SLL)LL,
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapMo5, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (m_aY8 :: * -> *))
                 (w_s2fS [Occ=Once!] :: Control.Monad.MonadPlus m_aY8)
                 (w3_s2fY [Occ=Once]
                    :: forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
                 (w4_s2fZ [Occ=Once] :: CompanyDatatypes.Salary) ->
                 case w_s2fS
                 of _
                 { Control.Monad.D:MonadPlus ww_s2fU [Occ=Once]
                                             ww1_s2fV [Occ=Once]
                                             ww2_s2fW [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapMo5
                   @ m_aY8 ww_s2fU ww1_s2fV ww2_s2fW w3_s2fY w4_s2fZ
                 }}]
CompanyDatatypes.$fDataSalary_$cgmapMo =
  \ (@ (m_aY8 :: * -> *))
    (w_s2fS :: Control.Monad.MonadPlus m_aY8)
    (w3_s2fY
       :: forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
    (w4_s2fZ :: CompanyDatatypes.Salary) ->
    case w_s2fS
    of _ { Control.Monad.D:MonadPlus ww_s2fU ww1_s2fV ww2_s2fW ->
    CompanyDatatypes.$w$cgmapMo5
      @ m_aY8 ww_s2fU ww1_s2fV ww2_s2fW w3_s2fY w4_s2fZ
    }

CompanyDatatypes.$w$cgmapMp3
  :: forall (m_aXe :: * -> *).
     GHC.Base.Monad m_aXe =>
     (forall a_a1nd. m_aXe a_a1nd)
     -> (forall a_a1nc. m_aXe a_a1nc -> m_aXe a_a1nc -> m_aXe a_a1nc)
     -> (forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
     -> CompanyDatatypes.Salary
     -> m_aXe CompanyDatatypes.Salary
[GblId,
 Arity=5,
 Str=DmdType SLLLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=5, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [20 0 60 60 20] 390 0}]
CompanyDatatypes.$w$cgmapMp3 =
  \ (@ (m_aXe :: * -> *))
    (ww_s2gc :: GHC.Base.Monad m_aXe)
    (ww1_s2gd :: forall a_a1nd. m_aXe a_a1nd)
    (ww2_s2ge
       :: forall a_a1nc. m_aXe a_a1nc -> m_aXe a_a1nc -> m_aXe a_a1nc)
    (w_s2gg
       :: forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
    (w3_s2gh :: CompanyDatatypes.Salary) ->
    case ww_s2gc
    of _ { GHC.Base.D:Monad ww3_s2g2 ww4_s2g3 ww5_s2g4 ww6_s2g5 ->
    ww3_s2g2
      @ (CompanyDatatypes.Salary, GHC.Types.Bool)
      @ CompanyDatatypes.Salary
      (case w3_s2gh of _ { CompanyDatatypes.S a22_aS7 ->
       let {
         lvl11_s1Fc [Dmd=Just L] :: m_aXe GHC.Types.Float
         [LclId, Str=DmdType]
         lvl11_s1Fc =
           w_s2gg @ GHC.Types.Float Data.Data.$fDataFloat a22_aS7 } in
       ww3_s2g2
         @ (GHC.Types.Float -> CompanyDatatypes.Salary, GHC.Types.Bool)
         @ (CompanyDatatypes.Salary, GHC.Types.Bool)
         (ww5_s2g4
            @ (GHC.Types.Float -> CompanyDatatypes.Salary, GHC.Types.Bool)
            CompanyDatatypes.$fDataSalary1)
         (\ (ds1_a1nF
               :: (GHC.Types.Float -> CompanyDatatypes.Salary, GHC.Types.Bool)) ->
            case ds1_a1nF of _ { (h_a1nI, b_a1nJ) ->
            ww2_s2ge
              @ (CompanyDatatypes.Salary, GHC.Types.Bool)
              (ww3_s2g2
                 @ GHC.Types.Float
                 @ (CompanyDatatypes.Salary, GHC.Types.Bool)
                 lvl11_s1Fc
                 (\ (y'_a1nL :: GHC.Types.Float) ->
                    ww5_s2g4
                      @ (CompanyDatatypes.Salary, GHC.Types.Bool)
                      (h_a1nI y'_a1nL, GHC.Types.True)))
              (ww5_s2g4
                 @ (CompanyDatatypes.Salary, GHC.Types.Bool)
                 (h_a1nI a22_aS7, b_a1nJ))
            })
       })
      (\ (ds_a1nR :: (CompanyDatatypes.Salary, GHC.Types.Bool)) ->
         case ds_a1nR of _ { (x'_a1nU, b_a1nV) ->
         case b_a1nV of _ {
           GHC.Types.False -> ww1_s2gd @ CompanyDatatypes.Salary;
           GHC.Types.True -> ww5_s2g4 @ CompanyDatatypes.Salary x'_a1nU
         }
         })
    }

CompanyDatatypes.$fDataSalary_$cgmapMp [InlPrag=INLINE[0]]
  :: forall (m_aXe :: * -> *).
     Control.Monad.MonadPlus m_aXe =>
     (forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
     -> CompanyDatatypes.Salary -> m_aXe CompanyDatatypes.Salary
[GblId,
 Arity=3,
 Str=DmdType U(SLL)LL,
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapMp3, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (m_aXe :: * -> *))
                 (w_s2ga [Occ=Once!] :: Control.Monad.MonadPlus m_aXe)
                 (w3_s2gg [Occ=Once]
                    :: forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
                 (w4_s2gh [Occ=Once] :: CompanyDatatypes.Salary) ->
                 case w_s2ga
                 of _
                 { Control.Monad.D:MonadPlus ww_s2gc [Occ=Once]
                                             ww1_s2gd [Occ=Once]
                                             ww2_s2ge [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapMp3
                   @ m_aXe ww_s2gc ww1_s2gd ww2_s2ge w3_s2gg w4_s2gh
                 }}]
CompanyDatatypes.$fDataSalary_$cgmapMp =
  \ (@ (m_aXe :: * -> *))
    (w_s2ga :: Control.Monad.MonadPlus m_aXe)
    (w3_s2gg
       :: forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
    (w4_s2gh :: CompanyDatatypes.Salary) ->
    case w_s2ga
    of _ { Control.Monad.D:MonadPlus ww_s2gc ww1_s2gd ww2_s2ge ->
    CompanyDatatypes.$w$cgmapMp3
      @ m_aXe ww_s2gc ww1_s2gd ww2_s2ge w3_s2gg w4_s2gh
    }

CompanyDatatypes.$w$cgmapM3
  :: forall (m_aX4 :: * -> *).
     (forall a_a1ne b_a1nf.
      m_aX4 a_a1ne -> (a_a1ne -> m_aX4 b_a1nf) -> m_aX4 b_a1nf)
     -> (forall a_a1ni. a_a1ni -> m_aX4 a_a1ni)
     -> (forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
     -> GHC.Types.Float
     -> m_aX4 CompanyDatatypes.Salary
[GblId,
 Arity=4,
 Str=DmdType SLLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=4, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [120 120 60 0] 180 0}]
CompanyDatatypes.$w$cgmapM3 =
  \ (@ (m_aX4 :: * -> *))
    (ww_s2go
       :: forall a_a1ne b_a1nf.
          m_aX4 a_a1ne -> (a_a1ne -> m_aX4 b_a1nf) -> m_aX4 b_a1nf)
    (ww1_s2gq :: forall a_a1ni. a_a1ni -> m_aX4 a_a1ni)
    (w_s2gt
       :: forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
    (ww2_s2gw :: GHC.Types.Float) ->
    let {
      lvl11_s1Fd [Dmd=Just L] :: m_aX4 GHC.Types.Float
      [LclId, Str=DmdType]
      lvl11_s1Fd =
        w_s2gt @ GHC.Types.Float Data.Data.$fDataFloat ww2_s2gw } in
    ww_s2go
      @ (GHC.Types.Float -> CompanyDatatypes.Salary)
      @ CompanyDatatypes.Salary
      (ww1_s2gq
         @ (GHC.Types.Float -> CompanyDatatypes.Salary) CompanyDatatypes.S)
      (\ (c'_a1og :: GHC.Types.Float -> CompanyDatatypes.Salary) ->
         ww_s2go
           @ GHC.Types.Float
           @ CompanyDatatypes.Salary
           lvl11_s1Fd
           (\ (x'_a1oh :: GHC.Types.Float) ->
              ww1_s2gq @ CompanyDatatypes.Salary (c'_a1og x'_a1oh)))

CompanyDatatypes.$fDataSalary_$cgmapM [InlPrag=INLINE[0]]
  :: forall (m_aX4 :: * -> *).
     GHC.Base.Monad m_aX4 =>
     (forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
     -> CompanyDatatypes.Salary -> m_aX4 CompanyDatatypes.Salary
[GblId,
 Arity=3,
 Str=DmdType U(SALA)LU(L),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapM3, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (m_aX4 :: * -> *))
                 (w_s2gm [Occ=Once!] :: GHC.Base.Monad m_aX4)
                 (w3_s2gt [Occ=Once]
                    :: forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
                 (w4_s2gu [Occ=Once!] :: CompanyDatatypes.Salary) ->
                 case w_s2gm
                 of _
                 { GHC.Base.D:Monad ww_s2go [Occ=Once] _ ww2_s2gq [Occ=Once] _ ->
                 case w4_s2gu of _ { CompanyDatatypes.S ww4_s2gw [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapM3
                   @ m_aX4 ww_s2go ww2_s2gq w3_s2gt ww4_s2gw
                 }
                 }}]
CompanyDatatypes.$fDataSalary_$cgmapM =
  \ (@ (m_aX4 :: * -> *))
    (w_s2gm :: GHC.Base.Monad m_aX4)
    (w3_s2gt
       :: forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
    (w4_s2gu :: CompanyDatatypes.Salary) ->
    case w_s2gm
    of _ { GHC.Base.D:Monad ww_s2go ww1_s2gp ww2_s2gq ww3_s2gr ->
    case w4_s2gu of _ { CompanyDatatypes.S ww4_s2gw ->
    CompanyDatatypes.$w$cgmapM3
      @ m_aX4 ww_s2go ww2_s2gq w3_s2gt ww4_s2gw
    }
    }

CompanyDatatypes.$fDataSalary_$cgmapQi
  :: forall u_aWW.
     GHC.Types.Int
     -> (forall d_aWX. Data.Data.Data d_aWX => d_aWX -> u_aWW)
     -> CompanyDatatypes.Salary
     -> u_aWW
[GblId,
 Arity=3,
 Str=DmdType U(L)C(C(S))U(L),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=3, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ u_a1ol)
                 (i_a1om [Occ=Once!] :: GHC.Types.Int)
                 (f_a1on [Occ=Once!]
                    :: forall d_a1oo. Data.Data.Data d_a1oo => d_a1oo -> u_a1ol)
                 (x_a1op [Occ=Once!] :: CompanyDatatypes.Salary) ->
                 case x_a1op of _ { CompanyDatatypes.S a22_aS7 [Occ=Once] ->
                 case i_a1om of _ { GHC.Types.I# x1_a1p2 [Occ=Once!] ->
                 case x1_a1p2 of _ {
                   __DEFAULT -> Data.Maybe.fromJust1 @ u_a1ol;
                   0 -> f_a1on @ GHC.Types.Float Data.Data.$fDataFloat a22_aS7
                 }
                 }
                 }}]
CompanyDatatypes.$fDataSalary_$cgmapQi =
  \ (@ u_a1ol)
    (i_a1om :: GHC.Types.Int)
    (f_a1on
       :: forall d_a1oo. Data.Data.Data d_a1oo => d_a1oo -> u_a1ol)
    (x_a1op :: CompanyDatatypes.Salary) ->
    case x_a1op of _ { CompanyDatatypes.S a22_aS7 ->
    case i_a1om of _ { GHC.Types.I# x1_a1p2 ->
    case x1_a1p2 of _ {
      __DEFAULT -> Data.Maybe.fromJust1 @ u_a1ol;
      0 -> f_a1on @ GHC.Types.Float Data.Data.$fDataFloat a22_aS7
    }
    }
    }

CompanyDatatypes.$fDataSalary_$cgmapQr
  :: forall r_aWE r'_aWF.
     (r'_aWF -> r_aWE -> r_aWE)
     -> r_aWE
     -> (forall d_aWG. Data.Data.Data d_aWG => d_aWG -> r'_aWF)
     -> CompanyDatatypes.Salary
     -> r_aWE
[GblId,
 Arity=4,
 Str=DmdType C(C(S))LLU(L),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=4, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ r_a1pQ)
                 (@ r'_a1pR)
                 (o_a1pS [Occ=Once!] :: r'_a1pR -> r_a1pQ -> r_a1pQ)
                 (r0_a1pT [Occ=Once] :: r_a1pQ)
                 (f_a1pU [Occ=Once!]
                    :: forall d_a1pV. Data.Data.Data d_a1pV => d_a1pV -> r'_a1pR)
                 (x0_a1pW [Occ=Once!] :: CompanyDatatypes.Salary) ->
                 case x0_a1pW of _ { CompanyDatatypes.S a22_aS7 [Occ=Once] ->
                 o_a1pS
                   (f_a1pU @ GHC.Types.Float Data.Data.$fDataFloat a22_aS7) r0_a1pT
                 }}]
CompanyDatatypes.$fDataSalary_$cgmapQr =
  \ (@ r_a1pQ)
    (@ r'_a1pR)
    (o_a1pS :: r'_a1pR -> r_a1pQ -> r_a1pQ)
    (r0_a1pT :: r_a1pQ)
    (f_a1pU
       :: forall d_a1pV. Data.Data.Data d_a1pV => d_a1pV -> r'_a1pR)
    (x0_a1pW :: CompanyDatatypes.Salary) ->
    case x0_a1pW of _ { CompanyDatatypes.S a22_aS7 ->
    o_a1pS
      (f_a1pU @ GHC.Types.Float Data.Data.$fDataFloat a22_aS7) r0_a1pT
    }

CompanyDatatypes.$fDataSalary_$cgmapQ
  :: forall u_aWO.
     (forall d_aWP. Data.Data.Data d_aWP => d_aWP -> u_aWO)
     -> CompanyDatatypes.Salary -> [u_aWO]
[GblId,
 Arity=2,
 Str=DmdType LU(L),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ u_a1pL)
                 (f_a1pM [Occ=Once!]
                    :: forall d_a1pN. Data.Data.Data d_a1pN => d_a1pN -> u_a1pL)
                 (eta_B1 [Occ=Once!] :: CompanyDatatypes.Salary) ->
                 case eta_B1 of _ { CompanyDatatypes.S a22_aS7 [Occ=Once] ->
                 GHC.Types.:
                   @ u_a1pL
                   (f_a1pM @ GHC.Types.Float Data.Data.$fDataFloat a22_aS7)
                   (GHC.Types.[] @ u_a1pL)
                 }}]
CompanyDatatypes.$fDataSalary_$cgmapQ =
  \ (@ u_a1pL)
    (f_a1pM
       :: forall d_a1pN. Data.Data.Data d_a1pN => d_a1pN -> u_a1pL)
    (eta_B1 :: CompanyDatatypes.Salary) ->
    case eta_B1 of _ { CompanyDatatypes.S a22_aS7 ->
    GHC.Types.:
      @ u_a1pL
      (f_a1pM @ GHC.Types.Float Data.Data.$fDataFloat a22_aS7)
      (GHC.Types.[] @ u_a1pL)
    }

CompanyDatatypes.$fDataSalary_$cgmapQl
  :: forall r_aWu r'_aWv.
     (r_aWu -> r'_aWv -> r_aWu)
     -> r_aWu
     -> (forall d_aWw. Data.Data.Data d_aWw => d_aWw -> r'_aWv)
     -> CompanyDatatypes.Salary
     -> r_aWu
[GblId,
 Arity=4,
 Str=DmdType C(C(S))LLU(L),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=4, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ r_a1qt)
                 (@ r'_a1qu)
                 (o_a1qv [Occ=Once!] :: r_a1qt -> r'_a1qu -> r_a1qt)
                 (r_a1qw [Occ=Once] :: r_a1qt)
                 (f_a1qx [Occ=Once!]
                    :: forall d_a1qy. Data.Data.Data d_a1qy => d_a1qy -> r'_a1qu)
                 (eta_B1 [Occ=Once!] :: CompanyDatatypes.Salary) ->
                 case eta_B1 of _ { CompanyDatatypes.S a22_aS7 [Occ=Once] ->
                 o_a1qv
                   r_a1qw (f_a1qx @ GHC.Types.Float Data.Data.$fDataFloat a22_aS7)
                 }}]
CompanyDatatypes.$fDataSalary_$cgmapQl =
  \ (@ r_a1qt)
    (@ r'_a1qu)
    (o_a1qv :: r_a1qt -> r'_a1qu -> r_a1qt)
    (r_a1qw :: r_a1qt)
    (f_a1qx
       :: forall d_a1qy. Data.Data.Data d_a1qy => d_a1qy -> r'_a1qu)
    (eta_B1 :: CompanyDatatypes.Salary) ->
    case eta_B1 of _ { CompanyDatatypes.S a22_aS7 ->
    o_a1qv
      r_a1qw (f_a1qx @ GHC.Types.Float Data.Data.$fDataFloat a22_aS7)
    }

CompanyDatatypes.$fDataSalary_$cgmapT
  :: (forall b_aWo. Data.Data.Data b_aWo => b_aWo -> b_aWo)
     -> CompanyDatatypes.Salary -> CompanyDatatypes.Salary
[GblId,
 Arity=2,
 Str=DmdType LU(L)m,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (f_a1r7 [Occ=Once!]
                    :: forall b_a1r8. Data.Data.Data b_a1r8 => b_a1r8 -> b_a1r8)
                 (x0_a1r9 [Occ=Once!] :: CompanyDatatypes.Salary) ->
                 case x0_a1r9 of _ { CompanyDatatypes.S a22_aS7 [Occ=Once] ->
                 CompanyDatatypes.S
                   (f_a1r7 @ GHC.Types.Float Data.Data.$fDataFloat a22_aS7)
                 }}]
CompanyDatatypes.$fDataSalary_$cgmapT =
  \ (f_a1r7
       :: forall b_a1r8. Data.Data.Data b_a1r8 => b_a1r8 -> b_a1r8)
    (x0_a1r9 :: CompanyDatatypes.Salary) ->
    case x0_a1r9 of _ { CompanyDatatypes.S a22_aS7 ->
    CompanyDatatypes.S
      (f_a1r7 @ GHC.Types.Float Data.Data.$fDataFloat a22_aS7)
    }

CompanyDatatypes.$fDataSalary_$cdataCast2
  :: forall (c_aWc :: * -> *) (t_aWd :: * -> * -> *).
     Data.Typeable.Internal.Typeable2 t_aWd =>
     (forall d_aWe e_aWf.
      (Data.Data.Data d_aWe, Data.Data.Data e_aWf) =>
      c_aWc (t_aWd d_aWe e_aWf))
     -> Data.Maybe.Maybe (c_aWc CompanyDatatypes.Salary)
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType AA,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ (@ (c_a1rt :: * -> *)) (@ (t_a1ru :: * -> * -> *)) _ _ ->
                 Data.Maybe.Nothing @ (c_a1rt CompanyDatatypes.Salary)}]
CompanyDatatypes.$fDataSalary_$cdataCast2 =
  \ (@ (c_a1rt :: * -> *)) (@ (t_a1ru :: * -> * -> *)) _ _ ->
    Data.Maybe.Nothing @ (c_a1rt CompanyDatatypes.Salary)

CompanyDatatypes.$fDataSalary_$cdataCast1
  :: forall (c_aVp :: * -> *) (t_aVq :: * -> *).
     Data.Typeable.Internal.Typeable1 t_aVq =>
     (forall d_aVr. Data.Data.Data d_aVr => c_aVp (t_aVq d_aVr))
     -> Data.Maybe.Maybe (c_aVp CompanyDatatypes.Salary)
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType AA,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ (@ (c_a1rB :: * -> *)) (@ (t_a1rC :: * -> *)) _ _ ->
                 Data.Maybe.Nothing @ (c_a1rB CompanyDatatypes.Salary)}]
CompanyDatatypes.$fDataSalary_$cdataCast1 =
  \ (@ (c_a1rB :: * -> *)) (@ (t_a1rC :: * -> *)) _ _ ->
    Data.Maybe.Nothing @ (c_a1rB CompanyDatatypes.Salary)

CompanyDatatypes.$fDataSalary [InlPrag=[ALWAYS] CONLIKE]
  :: Data.Data.Data CompanyDatatypes.Salary
[GblId[DFunId],
 Str=DmdType,
 Unf=DFun(arity=0) Data.Data.D:Data [{CompanyDatatypes.$fTypeableSalary},
                                     {CompanyDatatypes.$fDataSalary_$cgfoldl},
                                     {CompanyDatatypes.$fDataSalary_$cgunfold},
                                     {CompanyDatatypes.$fDataSalary_$ctoConstr},
                                     {CompanyDatatypes.$fDataSalary_$cdataTypeOf},
                                     {CompanyDatatypes.$fDataSalary_$cdataCast1},
                                     {CompanyDatatypes.$fDataSalary_$cdataCast2},
                                     {CompanyDatatypes.$fDataSalary_$cgmapT},
                                     {CompanyDatatypes.$fDataSalary_$cgmapQl},
                                     {CompanyDatatypes.$fDataSalary_$cgmapQr},
                                     {CompanyDatatypes.$fDataSalary_$cgmapQ},
                                     {CompanyDatatypes.$fDataSalary_$cgmapQi},
                                     {CompanyDatatypes.$fDataSalary_$cgmapM},
                                     {CompanyDatatypes.$fDataSalary_$cgmapMp},
                                     {CompanyDatatypes.$fDataSalary_$cgmapMo}]]
CompanyDatatypes.$fDataSalary =
  Data.Data.D:Data
    @ CompanyDatatypes.Salary
    (CompanyDatatypes.$fTypeableSalary_$ctypeOf
     `cast` (Sym
               <(Data.Typeable.Internal.NTCo:Typeable <CompanyDatatypes.Salary>)>
             :: (CompanyDatatypes.Salary -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable CompanyDatatypes.Salary))
    CompanyDatatypes.$fDataSalary_$cgfoldl
    CompanyDatatypes.$fDataSalary_$cgunfold
    CompanyDatatypes.$fDataSalary_$ctoConstr
    CompanyDatatypes.$fDataSalary_$cdataTypeOf
    CompanyDatatypes.$fDataSalary_$cdataCast1
    CompanyDatatypes.$fDataSalary_$cdataCast2
    CompanyDatatypes.$fDataSalary_$cgmapT
    CompanyDatatypes.$fDataSalary_$cgmapQl
    CompanyDatatypes.$fDataSalary_$cgmapQr
    CompanyDatatypes.$fDataSalary_$cgmapQ
    CompanyDatatypes.$fDataSalary_$cgmapQi
    CompanyDatatypes.$fDataSalary_$cgmapM
    CompanyDatatypes.$fDataSalary_$cgmapMp
    CompanyDatatypes.$fDataSalary_$cgmapMo

CompanyDatatypes.$w$cgfoldl1
  :: forall (c_aV0 :: * -> *).
     (forall d_aV1 b_aV2.
      Data.Data.Data d_aV1 =>
      c_aV0 (d_aV1 -> b_aV2) -> d_aV1 -> c_aV0 b_aV2)
     -> (forall g_aV3. g_aV3 -> c_aV0 g_aV3)
     -> CompanyDatatypes.Person
     -> CompanyDatatypes.Salary
     -> c_aV0 CompanyDatatypes.Employee
[GblId,
 Arity=4,
 Str=DmdType C(C(C(S)))LLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=4, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [120 60 0 0] 100 0}]
CompanyDatatypes.$w$cgfoldl1 =
  \ (@ (c_aV0 :: * -> *))
    (w_s2gC
       :: forall d_aV1 b_aV2.
          Data.Data.Data d_aV1 =>
          c_aV0 (d_aV1 -> b_aV2) -> d_aV1 -> c_aV0 b_aV2)
    (w3_s2gD :: forall g_aV3. g_aV3 -> c_aV0 g_aV3)
    (ww_s2gG :: CompanyDatatypes.Person)
    (ww1_s2gH :: CompanyDatatypes.Salary) ->
    w_s2gC
      @ CompanyDatatypes.Salary
      @ CompanyDatatypes.Employee
      CompanyDatatypes.$fDataSalary
      (w_s2gC
         @ CompanyDatatypes.Person
         @ (CompanyDatatypes.Salary -> CompanyDatatypes.Employee)
         CompanyDatatypes.$fDataPerson
         (w3_s2gD
            @ (CompanyDatatypes.Person
               -> CompanyDatatypes.Salary -> CompanyDatatypes.Employee)
            CompanyDatatypes.E)
         ww_s2gG)
      ww1_s2gH

CompanyDatatypes.$fDataEmployee_$cgfoldl [InlPrag=INLINE[0]]
  :: forall (c_aV0 :: * -> *).
     (forall d_aV1 b_aV2.
      Data.Data.Data d_aV1 =>
      c_aV0 (d_aV1 -> b_aV2) -> d_aV1 -> c_aV0 b_aV2)
     -> (forall g_aV3. g_aV3 -> c_aV0 g_aV3)
     -> CompanyDatatypes.Employee
     -> c_aV0 CompanyDatatypes.Employee
[GblId,
 Arity=3,
 Str=DmdType C(C(C(S)))LU(LL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgfoldl1, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (c_aV0 :: * -> *))
                 (w_s2gC [Occ=Once]
                    :: forall d_aV1 b_aV2.
                       Data.Data.Data d_aV1 =>
                       c_aV0 (d_aV1 -> b_aV2) -> d_aV1 -> c_aV0 b_aV2)
                 (w3_s2gD [Occ=Once] :: forall g_aV3. g_aV3 -> c_aV0 g_aV3)
                 (w4_s2gE [Occ=Once!] :: CompanyDatatypes.Employee) ->
                 case w4_s2gE
                 of _ { CompanyDatatypes.E ww_s2gG [Occ=Once] ww1_s2gH [Occ=Once] ->
                 CompanyDatatypes.$w$cgfoldl1
                   @ c_aV0 w_s2gC w3_s2gD ww_s2gG ww1_s2gH
                 }}]
CompanyDatatypes.$fDataEmployee_$cgfoldl =
  \ (@ (c_aV0 :: * -> *))
    (w_s2gC
       :: forall d_aV1 b_aV2.
          Data.Data.Data d_aV1 =>
          c_aV0 (d_aV1 -> b_aV2) -> d_aV1 -> c_aV0 b_aV2)
    (w3_s2gD :: forall g_aV3. g_aV3 -> c_aV0 g_aV3)
    (w4_s2gE :: CompanyDatatypes.Employee) ->
    case w4_s2gE of _ { CompanyDatatypes.E ww_s2gG ww1_s2gH ->
    CompanyDatatypes.$w$cgfoldl1
      @ c_aV0 w_s2gC w3_s2gD ww_s2gG ww1_s2gH
    }

CompanyDatatypes.$fDataEmployee_$cgunfold
  :: forall (c_aV9 :: * -> *).
     (forall b_aVa r_aVb.
      Data.Data.Data b_aVa =>
      c_aV9 (b_aVa -> r_aVb) -> c_aV9 r_aVb)
     -> (forall r_aVc. r_aVc -> c_aV9 r_aVc)
     -> Data.Data.Constr
     -> c_aV9 CompanyDatatypes.Employee
[GblId,
 Arity=3,
 Str=DmdType C(C(S))LA,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=3, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (c_t25 :: * -> *))
                 (k_aSC
                    :: forall b_aVa r_aVb.
                       Data.Data.Data b_aVa =>
                       c_t25 (b_aVa -> r_aVb) -> c_t25 r_aVb)
                 (z_aSD [Occ=Once!] :: forall r_aVc. r_aVc -> c_t25 r_aVc)
                 _ ->
                 k_aSC
                   @ CompanyDatatypes.Salary
                   @ CompanyDatatypes.Employee
                   CompanyDatatypes.$fDataSalary
                   (k_aSC
                      @ CompanyDatatypes.Person
                      @ (CompanyDatatypes.Salary -> CompanyDatatypes.Employee)
                      CompanyDatatypes.$fDataPerson
                      (z_aSD
                         @ (CompanyDatatypes.Person
                            -> CompanyDatatypes.Salary -> CompanyDatatypes.Employee)
                         CompanyDatatypes.E))}]
CompanyDatatypes.$fDataEmployee_$cgunfold =
  \ (@ (c_t25 :: * -> *))
    (k_aSC
       :: forall b_aVa r_aVb.
          Data.Data.Data b_aVa =>
          c_t25 (b_aVa -> r_aVb) -> c_t25 r_aVb)
    (z_aSD :: forall r_aVc. r_aVc -> c_t25 r_aVc)
    _ ->
    k_aSC
      @ CompanyDatatypes.Salary
      @ CompanyDatatypes.Employee
      CompanyDatatypes.$fDataSalary
      (k_aSC
         @ CompanyDatatypes.Person
         @ (CompanyDatatypes.Salary -> CompanyDatatypes.Employee)
         CompanyDatatypes.$fDataPerson
         (z_aSD
            @ (CompanyDatatypes.Person
               -> CompanyDatatypes.Salary -> CompanyDatatypes.Employee)
            CompanyDatatypes.E))

CompanyDatatypes.$fDataEmployee1
  :: (CompanyDatatypes.Person
      -> CompanyDatatypes.Salary -> CompanyDatatypes.Employee,
      GHC.Types.Bool)
[GblId,
 Caf=NoCafRefs,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.$fDataEmployee1 =
  (CompanyDatatypes.E, GHC.Types.False)

CompanyDatatypes.$w$cgmapMo3
  :: forall (m_aY8 :: * -> *).
     GHC.Base.Monad m_aY8 =>
     (forall a_a1nd. m_aY8 a_a1nd)
     -> (forall a_a1nc. m_aY8 a_a1nc -> m_aY8 a_a1nc -> m_aY8 a_a1nc)
     -> (forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
     -> CompanyDatatypes.Employee
     -> m_aY8 CompanyDatatypes.Employee
[GblId,
 Arity=5,
 Str=DmdType SLLLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=5, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [20 0 60 60 20] 580 0}]
CompanyDatatypes.$w$cgmapMo3 =
  \ (@ (m_aY8 :: * -> *))
    (ww_s2gV :: GHC.Base.Monad m_aY8)
    (ww1_s2gW :: forall a_a1nd. m_aY8 a_a1nd)
    (ww2_s2gX
       :: forall a_a1nc. m_aY8 a_a1nc -> m_aY8 a_a1nc -> m_aY8 a_a1nc)
    (w_s2gZ
       :: forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
    (w3_s2h0 :: CompanyDatatypes.Employee) ->
    case ww_s2gV
    of _ { GHC.Base.D:Monad ww3_s2gL ww4_s2gM ww5_s2gN ww6_s2gO ->
    ww3_s2gL
      @ (CompanyDatatypes.Employee, GHC.Types.Bool)
      @ CompanyDatatypes.Employee
      (case w3_s2h0 of _ { CompanyDatatypes.E a22_aSA a23_aSB ->
       let {
         a24_s1KR
           :: forall d_X1xW b_X1xY.
              Data.Data.Data d_X1xW =>
              Data.Data.Mp m_aY8 (d_X1xW -> b_X1xY)
              -> d_X1xW -> m_aY8 (b_X1xY, GHC.Types.Bool)
         [LclId, Arity=3, Str=DmdType LLL]
         a24_s1KR =
           \ (@ d_a1mF)
             (@ b_a1mG)
             ($dData2_a1mH :: Data.Data.Data d_a1mF)
             (ds_a1mI :: Data.Data.Mp m_aY8 (d_a1mF -> b_a1mG))
             (y_a1mJ :: d_a1mF) ->
             let {
               lvl11_s1Fl :: m_aY8 d_a1mF
               [LclId, Str=DmdType]
               lvl11_s1Fl = w_s2gZ @ d_a1mF $dData2_a1mH y_a1mJ } in
             ww3_s2gL
               @ (d_a1mF -> b_a1mG, GHC.Types.Bool)
               @ (b_a1mG, GHC.Types.Bool)
               (ds_a1mI
                `cast` (<Data.Data.NTCo:Mp <m_aY8> <d_a1mF -> b_a1mG>>
                        :: Data.Data.Mp m_aY8 (d_a1mF -> b_a1mG)
                             ~#
                           m_aY8 (d_a1mF -> b_a1mG, GHC.Types.Bool)))
               (\ (ds1_a1mK :: (d_a1mF -> b_a1mG, GHC.Types.Bool)) ->
                  case ds1_a1mK of _ { (h_a1mN, b_a1mO) ->
                  case b_a1mO of _ {
                    GHC.Types.False ->
                      ww2_s2gX
                        @ (b_a1mG, GHC.Types.Bool)
                        (ww3_s2gL
                           @ d_a1mF
                           @ (b_a1mG, GHC.Types.Bool)
                           lvl11_s1Fl
                           (\ (y'_a1mT :: d_a1mF) ->
                              ww5_s2gN
                                @ (b_a1mG, GHC.Types.Bool) (h_a1mN y'_a1mT, GHC.Types.True)))
                        (ww5_s2gN
                           @ (b_a1mG, GHC.Types.Bool) (h_a1mN y_a1mJ, GHC.Types.False));
                    GHC.Types.True ->
                      ww5_s2gN @ (b_a1mG, GHC.Types.Bool) (h_a1mN y_a1mJ, GHC.Types.True)
                  }
                  }) } in
       a24_s1KR
         @ CompanyDatatypes.Salary
         @ CompanyDatatypes.Employee
         CompanyDatatypes.$fDataSalary
         ((a24_s1KR
             @ CompanyDatatypes.Person
             @ (CompanyDatatypes.Salary -> CompanyDatatypes.Employee)
             CompanyDatatypes.$fDataPerson
             ((ww5_s2gN
                 @ (CompanyDatatypes.Person
                    -> CompanyDatatypes.Salary -> CompanyDatatypes.Employee,
                    GHC.Types.Bool)
                 CompanyDatatypes.$fDataEmployee1)
              `cast` (Sym
                        <(Data.Data.NTCo:Mp
                            <m_aY8>
                            <CompanyDatatypes.Person
                             -> CompanyDatatypes.Salary -> CompanyDatatypes.Employee>)>
                      :: m_aY8 (CompanyDatatypes.Person
                                -> CompanyDatatypes.Salary -> CompanyDatatypes.Employee,
                                GHC.Types.Bool)
                           ~#
                         Data.Data.Mp
                           m_aY8
                           (CompanyDatatypes.Person
                            -> CompanyDatatypes.Salary -> CompanyDatatypes.Employee)))
             a22_aSA)
          `cast` (Sym
                    <(Data.Data.NTCo:Mp
                        <m_aY8> <CompanyDatatypes.Salary -> CompanyDatatypes.Employee>)>
                  :: m_aY8 (CompanyDatatypes.Salary -> CompanyDatatypes.Employee,
                            GHC.Types.Bool)
                       ~#
                     Data.Data.Mp
                       m_aY8 (CompanyDatatypes.Salary -> CompanyDatatypes.Employee)))
         a23_aSB
       })
      (\ (ds_a1n1 :: (CompanyDatatypes.Employee, GHC.Types.Bool)) ->
         case ds_a1n1 of _ { (x'_a1n4, b_a1n5) ->
         case b_a1n5 of _ {
           GHC.Types.False -> ww1_s2gW @ CompanyDatatypes.Employee;
           GHC.Types.True -> ww5_s2gN @ CompanyDatatypes.Employee x'_a1n4
         }
         })
    }

CompanyDatatypes.$fDataEmployee_$cgmapMo [InlPrag=INLINE[0]]
  :: forall (m_aY8 :: * -> *).
     Control.Monad.MonadPlus m_aY8 =>
     (forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
     -> CompanyDatatypes.Employee -> m_aY8 CompanyDatatypes.Employee
[GblId,
 Arity=3,
 Str=DmdType U(SLL)LL,
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapMo3, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (m_aY8 :: * -> *))
                 (w_s2gT [Occ=Once!] :: Control.Monad.MonadPlus m_aY8)
                 (w3_s2gZ [Occ=Once]
                    :: forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
                 (w4_s2h0 [Occ=Once] :: CompanyDatatypes.Employee) ->
                 case w_s2gT
                 of _
                 { Control.Monad.D:MonadPlus ww_s2gV [Occ=Once]
                                             ww1_s2gW [Occ=Once]
                                             ww2_s2gX [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapMo3
                   @ m_aY8 ww_s2gV ww1_s2gW ww2_s2gX w3_s2gZ w4_s2h0
                 }}]
CompanyDatatypes.$fDataEmployee_$cgmapMo =
  \ (@ (m_aY8 :: * -> *))
    (w_s2gT :: Control.Monad.MonadPlus m_aY8)
    (w3_s2gZ
       :: forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
    (w4_s2h0 :: CompanyDatatypes.Employee) ->
    case w_s2gT
    of _ { Control.Monad.D:MonadPlus ww_s2gV ww1_s2gW ww2_s2gX ->
    CompanyDatatypes.$w$cgmapMo3
      @ m_aY8 ww_s2gV ww1_s2gW ww2_s2gX w3_s2gZ w4_s2h0
    }

CompanyDatatypes.$w$cgmapMp4
  :: forall (m_aXe :: * -> *).
     GHC.Base.Monad m_aXe =>
     (forall a_a1nd. m_aXe a_a1nd)
     -> (forall a_a1nc. m_aXe a_a1nc -> m_aXe a_a1nc -> m_aXe a_a1nc)
     -> (forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
     -> CompanyDatatypes.Employee
     -> m_aXe CompanyDatatypes.Employee
[GblId,
 Arity=5,
 Str=DmdType SLLLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=5, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [20 0 60 60 20] 510 0}]
CompanyDatatypes.$w$cgmapMp4 =
  \ (@ (m_aXe :: * -> *))
    (ww_s2hd :: GHC.Base.Monad m_aXe)
    (ww1_s2he :: forall a_a1nd. m_aXe a_a1nd)
    (ww2_s2hf
       :: forall a_a1nc. m_aXe a_a1nc -> m_aXe a_a1nc -> m_aXe a_a1nc)
    (w_s2hh
       :: forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
    (w3_s2hi :: CompanyDatatypes.Employee) ->
    case ww_s2hd
    of _ { GHC.Base.D:Monad ww3_s2h3 ww4_s2h4 ww5_s2h5 ww6_s2h6 ->
    ww3_s2h3
      @ (CompanyDatatypes.Employee, GHC.Types.Bool)
      @ CompanyDatatypes.Employee
      (case w3_s2hi of _ { CompanyDatatypes.E a22_aSA a23_aSB ->
       let {
         a24_s1KX
           :: forall d_X1yT b_X1yV.
              Data.Data.Data d_X1yT =>
              Data.Data.Mp m_aXe (d_X1yT -> b_X1yV)
              -> d_X1yT -> m_aXe (b_X1yV, GHC.Types.Bool)
         [LclId, Arity=3, Str=DmdType LLL]
         a24_s1KX =
           \ (@ d_a1nA)
             (@ b_a1nB)
             ($dData2_a1nC :: Data.Data.Data d_a1nA)
             (ds_a1nD :: Data.Data.Mp m_aXe (d_a1nA -> b_a1nB))
             (y_a1nE :: d_a1nA) ->
             let {
               lvl11_s1Fn [Dmd=Just L] :: m_aXe d_a1nA
               [LclId, Str=DmdType]
               lvl11_s1Fn = w_s2hh @ d_a1nA $dData2_a1nC y_a1nE } in
             ww3_s2h3
               @ (d_a1nA -> b_a1nB, GHC.Types.Bool)
               @ (b_a1nB, GHC.Types.Bool)
               (ds_a1nD
                `cast` (<Data.Data.NTCo:Mp <m_aXe> <d_a1nA -> b_a1nB>>
                        :: Data.Data.Mp m_aXe (d_a1nA -> b_a1nB)
                             ~#
                           m_aXe (d_a1nA -> b_a1nB, GHC.Types.Bool)))
               (\ (ds1_a1nF :: (d_a1nA -> b_a1nB, GHC.Types.Bool)) ->
                  case ds1_a1nF of _ { (h_a1nI, b_a1nJ) ->
                  ww2_s2hf
                    @ (b_a1nB, GHC.Types.Bool)
                    (ww3_s2h3
                       @ d_a1nA
                       @ (b_a1nB, GHC.Types.Bool)
                       lvl11_s1Fn
                       (\ (y'_a1nL :: d_a1nA) ->
                          ww5_s2h5
                            @ (b_a1nB, GHC.Types.Bool) (h_a1nI y'_a1nL, GHC.Types.True)))
                    (ww5_s2h5 @ (b_a1nB, GHC.Types.Bool) (h_a1nI y_a1nE, b_a1nJ))
                  }) } in
       a24_s1KX
         @ CompanyDatatypes.Salary
         @ CompanyDatatypes.Employee
         CompanyDatatypes.$fDataSalary
         ((a24_s1KX
             @ CompanyDatatypes.Person
             @ (CompanyDatatypes.Salary -> CompanyDatatypes.Employee)
             CompanyDatatypes.$fDataPerson
             ((ww5_s2h5
                 @ (CompanyDatatypes.Person
                    -> CompanyDatatypes.Salary -> CompanyDatatypes.Employee,
                    GHC.Types.Bool)
                 CompanyDatatypes.$fDataEmployee1)
              `cast` (Sym
                        <(Data.Data.NTCo:Mp
                            <m_aXe>
                            <CompanyDatatypes.Person
                             -> CompanyDatatypes.Salary -> CompanyDatatypes.Employee>)>
                      :: m_aXe (CompanyDatatypes.Person
                                -> CompanyDatatypes.Salary -> CompanyDatatypes.Employee,
                                GHC.Types.Bool)
                           ~#
                         Data.Data.Mp
                           m_aXe
                           (CompanyDatatypes.Person
                            -> CompanyDatatypes.Salary -> CompanyDatatypes.Employee)))
             a22_aSA)
          `cast` (Sym
                    <(Data.Data.NTCo:Mp
                        <m_aXe> <CompanyDatatypes.Salary -> CompanyDatatypes.Employee>)>
                  :: m_aXe (CompanyDatatypes.Salary -> CompanyDatatypes.Employee,
                            GHC.Types.Bool)
                       ~#
                     Data.Data.Mp
                       m_aXe (CompanyDatatypes.Salary -> CompanyDatatypes.Employee)))
         a23_aSB
       })
      (\ (ds_a1nR :: (CompanyDatatypes.Employee, GHC.Types.Bool)) ->
         case ds_a1nR of _ { (x'_a1nU, b_a1nV) ->
         case b_a1nV of _ {
           GHC.Types.False -> ww1_s2he @ CompanyDatatypes.Employee;
           GHC.Types.True -> ww5_s2h5 @ CompanyDatatypes.Employee x'_a1nU
         }
         })
    }

CompanyDatatypes.$fDataEmployee_$cgmapMp [InlPrag=INLINE[0]]
  :: forall (m_aXe :: * -> *).
     Control.Monad.MonadPlus m_aXe =>
     (forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
     -> CompanyDatatypes.Employee -> m_aXe CompanyDatatypes.Employee
[GblId,
 Arity=3,
 Str=DmdType U(SLL)LL,
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapMp4, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (m_aXe :: * -> *))
                 (w_s2hb [Occ=Once!] :: Control.Monad.MonadPlus m_aXe)
                 (w3_s2hh [Occ=Once]
                    :: forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
                 (w4_s2hi [Occ=Once] :: CompanyDatatypes.Employee) ->
                 case w_s2hb
                 of _
                 { Control.Monad.D:MonadPlus ww_s2hd [Occ=Once]
                                             ww1_s2he [Occ=Once]
                                             ww2_s2hf [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapMp4
                   @ m_aXe ww_s2hd ww1_s2he ww2_s2hf w3_s2hh w4_s2hi
                 }}]
CompanyDatatypes.$fDataEmployee_$cgmapMp =
  \ (@ (m_aXe :: * -> *))
    (w_s2hb :: Control.Monad.MonadPlus m_aXe)
    (w3_s2hh
       :: forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
    (w4_s2hi :: CompanyDatatypes.Employee) ->
    case w_s2hb
    of _ { Control.Monad.D:MonadPlus ww_s2hd ww1_s2he ww2_s2hf ->
    CompanyDatatypes.$w$cgmapMp4
      @ m_aXe ww_s2hd ww1_s2he ww2_s2hf w3_s2hh w4_s2hi
    }

CompanyDatatypes.$w$cgmapM4
  :: forall (m_aX4 :: * -> *).
     (forall a_a1ne b_a1nf.
      m_aX4 a_a1ne -> (a_a1ne -> m_aX4 b_a1nf) -> m_aX4 b_a1nf)
     -> (forall a_a1ni. a_a1ni -> m_aX4 a_a1ni)
     -> (forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
     -> CompanyDatatypes.Person
     -> CompanyDatatypes.Salary
     -> m_aX4 CompanyDatatypes.Employee
[GblId,
 Arity=5,
 Str=DmdType SLLLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=5, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [120 120 60 0 0] 300 0}]
CompanyDatatypes.$w$cgmapM4 =
  \ (@ (m_aX4 :: * -> *))
    (ww_s2hp
       :: forall a_a1ne b_a1nf.
          m_aX4 a_a1ne -> (a_a1ne -> m_aX4 b_a1nf) -> m_aX4 b_a1nf)
    (ww1_s2hr :: forall a_a1ni. a_a1ni -> m_aX4 a_a1ni)
    (w_s2hu
       :: forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
    (ww2_s2hx :: CompanyDatatypes.Person)
    (ww3_s2hy :: CompanyDatatypes.Salary) ->
    let {
      k_aSy
        :: forall d_aV1 b_aV2.
           Data.Data.Data d_aV1 =>
           m_aX4 (d_aV1 -> b_aV2) -> d_aV1 -> m_aX4 b_aV2
      [LclId, Arity=3, Str=DmdType LLL]
      k_aSy =
        \ (@ d_a1ob)
          (@ b_a1oc)
          ($dData2_a1od :: Data.Data.Data d_a1ob)
          (c_a1oe :: m_aX4 (d_a1ob -> b_a1oc))
          (x_a1of :: d_a1ob) ->
          let {
            lvl11_s1Fo [Dmd=Just L] :: m_aX4 d_a1ob
            [LclId, Str=DmdType]
            lvl11_s1Fo = w_s2hu @ d_a1ob $dData2_a1od x_a1of } in
          ww_s2hp
            @ (d_a1ob -> b_a1oc)
            @ b_a1oc
            c_a1oe
            (\ (c'_a1og :: d_a1ob -> b_a1oc) ->
               ww_s2hp
                 @ d_a1ob
                 @ b_a1oc
                 lvl11_s1Fo
                 (\ (x'_a1oh :: d_a1ob) ->
                    ww1_s2hr @ b_a1oc (c'_a1og x'_a1oh))) } in
    k_aSy
      @ CompanyDatatypes.Salary
      @ CompanyDatatypes.Employee
      CompanyDatatypes.$fDataSalary
      (k_aSy
         @ CompanyDatatypes.Person
         @ (CompanyDatatypes.Salary -> CompanyDatatypes.Employee)
         CompanyDatatypes.$fDataPerson
         (ww1_s2hr
            @ (CompanyDatatypes.Person
               -> CompanyDatatypes.Salary -> CompanyDatatypes.Employee)
            CompanyDatatypes.E)
         ww2_s2hx)
      ww3_s2hy

CompanyDatatypes.$fDataEmployee_$cgmapM [InlPrag=INLINE[0]]
  :: forall (m_aX4 :: * -> *).
     GHC.Base.Monad m_aX4 =>
     (forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
     -> CompanyDatatypes.Employee -> m_aX4 CompanyDatatypes.Employee
[GblId,
 Arity=3,
 Str=DmdType U(SALA)LU(LL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapM4, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (m_aX4 :: * -> *))
                 (w_s2hn [Occ=Once!] :: GHC.Base.Monad m_aX4)
                 (w3_s2hu [Occ=Once]
                    :: forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
                 (w4_s2hv [Occ=Once!] :: CompanyDatatypes.Employee) ->
                 case w_s2hn
                 of _
                 { GHC.Base.D:Monad ww_s2hp [Occ=Once] _ ww2_s2hr [Occ=Once] _ ->
                 case w4_s2hv
                 of _
                 { CompanyDatatypes.E ww4_s2hx [Occ=Once] ww5_s2hy [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapM4
                   @ m_aX4 ww_s2hp ww2_s2hr w3_s2hu ww4_s2hx ww5_s2hy
                 }
                 }}]
CompanyDatatypes.$fDataEmployee_$cgmapM =
  \ (@ (m_aX4 :: * -> *))
    (w_s2hn :: GHC.Base.Monad m_aX4)
    (w3_s2hu
       :: forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
    (w4_s2hv :: CompanyDatatypes.Employee) ->
    case w_s2hn
    of _ { GHC.Base.D:Monad ww_s2hp ww1_s2hq ww2_s2hr ww3_s2hs ->
    case w4_s2hv of _ { CompanyDatatypes.E ww4_s2hx ww5_s2hy ->
    CompanyDatatypes.$w$cgmapM4
      @ m_aX4 ww_s2hp ww2_s2hr w3_s2hu ww4_s2hx ww5_s2hy
    }
    }

CompanyDatatypes.$w$cgmapQi2
  :: forall u_aWW.
     GHC.Prim.Int#
     -> (forall d_aWX. Data.Data.Data d_aWX => d_aWX -> u_aWW)
     -> CompanyDatatypes.Person
     -> CompanyDatatypes.Salary
     -> u_aWW
[GblId,
 Arity=4,
 Str=DmdType LC(C(S))LL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=4, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [70 120 0 0] 90 0}]
CompanyDatatypes.$w$cgmapQi2 =
  \ (@ u_aWW)
    (ww_s2hG :: GHC.Prim.Int#)
    (w_s2hI :: forall d_aWX. Data.Data.Data d_aWX => d_aWX -> u_aWW)
    (ww1_s2hL :: CompanyDatatypes.Person)
    (ww2_s2hM :: CompanyDatatypes.Salary) ->
    case ww_s2hG of _ {
      __DEFAULT -> Data.Maybe.fromJust1 @ u_aWW;
      0 ->
        w_s2hI
          @ CompanyDatatypes.Person CompanyDatatypes.$fDataPerson ww1_s2hL;
      1 ->
        w_s2hI
          @ CompanyDatatypes.Salary CompanyDatatypes.$fDataSalary ww2_s2hM
    }

CompanyDatatypes.$fDataEmployee_$cgmapQi [InlPrag=INLINE[0]]
  :: forall u_aWW.
     GHC.Types.Int
     -> (forall d_aWX. Data.Data.Data d_aWX => d_aWX -> u_aWW)
     -> CompanyDatatypes.Employee
     -> u_aWW
[GblId,
 Arity=3,
 Str=DmdType U(L)C(C(S))U(LL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapQi2, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ u_aWW)
                 (w_s2hE [Occ=Once!] :: GHC.Types.Int)
                 (w3_s2hI [Occ=Once]
                    :: forall d_aWX. Data.Data.Data d_aWX => d_aWX -> u_aWW)
                 (w4_s2hJ [Occ=Once!] :: CompanyDatatypes.Employee) ->
                 case w_s2hE of _ { GHC.Types.I# ww_s2hG [Occ=Once] ->
                 case w4_s2hJ
                 of _
                 { CompanyDatatypes.E ww1_s2hL [Occ=Once] ww2_s2hM [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapQi2
                   @ u_aWW ww_s2hG w3_s2hI ww1_s2hL ww2_s2hM
                 }
                 }}]
CompanyDatatypes.$fDataEmployee_$cgmapQi =
  \ (@ u_aWW)
    (w_s2hE :: GHC.Types.Int)
    (w3_s2hI :: forall d_aWX. Data.Data.Data d_aWX => d_aWX -> u_aWW)
    (w4_s2hJ :: CompanyDatatypes.Employee) ->
    case w_s2hE of _ { GHC.Types.I# ww_s2hG ->
    case w4_s2hJ of _ { CompanyDatatypes.E ww1_s2hL ww2_s2hM ->
    CompanyDatatypes.$w$cgmapQi2
      @ u_aWW ww_s2hG w3_s2hI ww1_s2hL ww2_s2hM
    }
    }

CompanyDatatypes.$w$cgmapQr2
  :: forall r_aWE r'_aWF.
     (r'_aWF -> r_aWE -> r_aWE)
     -> r_aWE
     -> (forall d_aWG. Data.Data.Data d_aWG => d_aWG -> r'_aWF)
     -> CompanyDatatypes.Person
     -> CompanyDatatypes.Salary
     -> r_aWE
[GblId,
 Arity=5,
 Str=DmdType C(C(S))LLLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=5, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [60 0 120 0 0] 120 0}]
CompanyDatatypes.$w$cgmapQr2 =
  \ (@ r_aWE)
    (@ r'_aWF)
    (w_s2hT :: r'_aWF -> r_aWE -> r_aWE)
    (w3_s2hU :: r_aWE)
    (w4_s2hV :: forall d_aWG. Data.Data.Data d_aWG => d_aWG -> r'_aWF)
    (ww_s2hY :: CompanyDatatypes.Person)
    (ww1_s2hZ :: CompanyDatatypes.Salary) ->
    w_s2hT
      (w4_s2hV
         @ CompanyDatatypes.Person CompanyDatatypes.$fDataPerson ww_s2hY)
      (w_s2hT
         (w4_s2hV
            @ CompanyDatatypes.Salary CompanyDatatypes.$fDataSalary ww1_s2hZ)
         w3_s2hU)

CompanyDatatypes.$fDataEmployee_$cgmapQr [InlPrag=INLINE[0]]
  :: forall r_aWE r'_aWF.
     (r'_aWF -> r_aWE -> r_aWE)
     -> r_aWE
     -> (forall d_aWG. Data.Data.Data d_aWG => d_aWG -> r'_aWF)
     -> CompanyDatatypes.Employee
     -> r_aWE
[GblId,
 Arity=4,
 Str=DmdType C(C(S))LLU(LL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapQr2, TopLvl=True,
         Arity=4, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ r_aWE)
                 (@ r'_aWF)
                 (w_s2hT [Occ=Once] :: r'_aWF -> r_aWE -> r_aWE)
                 (w3_s2hU [Occ=Once] :: r_aWE)
                 (w4_s2hV [Occ=Once]
                    :: forall d_aWG. Data.Data.Data d_aWG => d_aWG -> r'_aWF)
                 (w5_s2hW [Occ=Once!] :: CompanyDatatypes.Employee) ->
                 case w5_s2hW
                 of _ { CompanyDatatypes.E ww_s2hY [Occ=Once] ww1_s2hZ [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapQr2
                   @ r_aWE @ r'_aWF w_s2hT w3_s2hU w4_s2hV ww_s2hY ww1_s2hZ
                 }}]
CompanyDatatypes.$fDataEmployee_$cgmapQr =
  \ (@ r_aWE)
    (@ r'_aWF)
    (w_s2hT :: r'_aWF -> r_aWE -> r_aWE)
    (w3_s2hU :: r_aWE)
    (w4_s2hV :: forall d_aWG. Data.Data.Data d_aWG => d_aWG -> r'_aWF)
    (w5_s2hW :: CompanyDatatypes.Employee) ->
    case w5_s2hW of _ { CompanyDatatypes.E ww_s2hY ww1_s2hZ ->
    CompanyDatatypes.$w$cgmapQr2
      @ r_aWE @ r'_aWF w_s2hT w3_s2hU w4_s2hV ww_s2hY ww1_s2hZ
    }

CompanyDatatypes.$fDataEmployee_$cgmapQ
  :: forall u_aWO.
     (forall d_aWP. Data.Data.Data d_aWP => d_aWP -> u_aWO)
     -> CompanyDatatypes.Employee -> [u_aWO]
[GblId,
 Arity=2,
 Str=DmdType LU(LL),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ u_a1pL)
                 (f_a1pM
                    :: forall d_a1pN. Data.Data.Data d_a1pN => d_a1pN -> u_a1pL)
                 (eta_B1 [Occ=Once!] :: CompanyDatatypes.Employee) ->
                 case eta_B1
                 of _ { CompanyDatatypes.E a22_aSA [Occ=Once] a23_aSB [Occ=Once] ->
                 GHC.Types.:
                   @ u_a1pL
                   (f_a1pM
                      @ CompanyDatatypes.Person CompanyDatatypes.$fDataPerson a22_aSA)
                   (GHC.Types.:
                      @ u_a1pL
                      (f_a1pM
                         @ CompanyDatatypes.Salary CompanyDatatypes.$fDataSalary a23_aSB)
                      (GHC.Types.[] @ u_a1pL))
                 }}]
CompanyDatatypes.$fDataEmployee_$cgmapQ =
  \ (@ u_a1pL)
    (f_a1pM
       :: forall d_a1pN. Data.Data.Data d_a1pN => d_a1pN -> u_a1pL)
    (eta_B1 :: CompanyDatatypes.Employee) ->
    case eta_B1 of _ { CompanyDatatypes.E a22_aSA a23_aSB ->
    GHC.Types.:
      @ u_a1pL
      (f_a1pM
         @ CompanyDatatypes.Person CompanyDatatypes.$fDataPerson a22_aSA)
      (GHC.Types.:
         @ u_a1pL
         (f_a1pM
            @ CompanyDatatypes.Salary CompanyDatatypes.$fDataSalary a23_aSB)
         (GHC.Types.[] @ u_a1pL))
    }

CompanyDatatypes.$w$cgmapQl2
  :: forall r_aWu r'_aWv.
     (r_aWu -> r'_aWv -> r_aWu)
     -> r_aWu
     -> (forall d_aWw. Data.Data.Data d_aWw => d_aWw -> r'_aWv)
     -> CompanyDatatypes.Person
     -> CompanyDatatypes.Salary
     -> r_aWu
[GblId,
 Arity=5,
 Str=DmdType C(C(S))LLLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=5, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [60 0 120 0 0] 120 0}]
CompanyDatatypes.$w$cgmapQl2 =
  \ (@ r_aWu)
    (@ r'_aWv)
    (w_s2i6 :: r_aWu -> r'_aWv -> r_aWu)
    (w3_s2i7 :: r_aWu)
    (w4_s2i8 :: forall d_aWw. Data.Data.Data d_aWw => d_aWw -> r'_aWv)
    (ww_s2ib :: CompanyDatatypes.Person)
    (ww1_s2ic :: CompanyDatatypes.Salary) ->
    w_s2i6
      (w_s2i6
         w3_s2i7
         (w4_s2i8
            @ CompanyDatatypes.Person CompanyDatatypes.$fDataPerson ww_s2ib))
      (w4_s2i8
         @ CompanyDatatypes.Salary CompanyDatatypes.$fDataSalary ww1_s2ic)

CompanyDatatypes.$fDataEmployee_$cgmapQl [InlPrag=INLINE[0]]
  :: forall r_aWu r'_aWv.
     (r_aWu -> r'_aWv -> r_aWu)
     -> r_aWu
     -> (forall d_aWw. Data.Data.Data d_aWw => d_aWw -> r'_aWv)
     -> CompanyDatatypes.Employee
     -> r_aWu
[GblId,
 Arity=4,
 Str=DmdType C(C(S))LLU(LL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapQl2, TopLvl=True,
         Arity=4, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ r_aWu)
                 (@ r'_aWv)
                 (w_s2i6 [Occ=Once] :: r_aWu -> r'_aWv -> r_aWu)
                 (w3_s2i7 [Occ=Once] :: r_aWu)
                 (w4_s2i8 [Occ=Once]
                    :: forall d_aWw. Data.Data.Data d_aWw => d_aWw -> r'_aWv)
                 (w5_s2i9 [Occ=Once!] :: CompanyDatatypes.Employee) ->
                 case w5_s2i9
                 of _ { CompanyDatatypes.E ww_s2ib [Occ=Once] ww1_s2ic [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapQl2
                   @ r_aWu @ r'_aWv w_s2i6 w3_s2i7 w4_s2i8 ww_s2ib ww1_s2ic
                 }}]
CompanyDatatypes.$fDataEmployee_$cgmapQl =
  \ (@ r_aWu)
    (@ r'_aWv)
    (w_s2i6 :: r_aWu -> r'_aWv -> r_aWu)
    (w3_s2i7 :: r_aWu)
    (w4_s2i8 :: forall d_aWw. Data.Data.Data d_aWw => d_aWw -> r'_aWv)
    (w5_s2i9 :: CompanyDatatypes.Employee) ->
    case w5_s2i9 of _ { CompanyDatatypes.E ww_s2ib ww1_s2ic ->
    CompanyDatatypes.$w$cgmapQl2
      @ r_aWu @ r'_aWv w_s2i6 w3_s2i7 w4_s2i8 ww_s2ib ww1_s2ic
    }

CompanyDatatypes.$fDataEmployee_$cgmapT
  :: (forall b_aWo. Data.Data.Data b_aWo => b_aWo -> b_aWo)
     -> CompanyDatatypes.Employee -> CompanyDatatypes.Employee
[GblId,
 Arity=2,
 Str=DmdType LU(LL)m,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (f_a1r7
                    :: forall b_a1r8. Data.Data.Data b_a1r8 => b_a1r8 -> b_a1r8)
                 (x0_a1r9 [Occ=Once!] :: CompanyDatatypes.Employee) ->
                 case x0_a1r9
                 of _ { CompanyDatatypes.E a22_aSA [Occ=Once] a23_aSB [Occ=Once] ->
                 CompanyDatatypes.E
                   (f_a1r7
                      @ CompanyDatatypes.Person CompanyDatatypes.$fDataPerson a22_aSA)
                   (f_a1r7
                      @ CompanyDatatypes.Salary CompanyDatatypes.$fDataSalary a23_aSB)
                 }}]
CompanyDatatypes.$fDataEmployee_$cgmapT =
  \ (f_a1r7
       :: forall b_a1r8. Data.Data.Data b_a1r8 => b_a1r8 -> b_a1r8)
    (x0_a1r9 :: CompanyDatatypes.Employee) ->
    case x0_a1r9 of _ { CompanyDatatypes.E a22_aSA a23_aSB ->
    CompanyDatatypes.E
      (f_a1r7
         @ CompanyDatatypes.Person CompanyDatatypes.$fDataPerson a22_aSA)
      (f_a1r7
         @ CompanyDatatypes.Salary CompanyDatatypes.$fDataSalary a23_aSB)
    }

CompanyDatatypes.$fDataEmployee_$cdataCast2
  :: forall (c_aWc :: * -> *) (t_aWd :: * -> * -> *).
     Data.Typeable.Internal.Typeable2 t_aWd =>
     (forall d_aWe e_aWf.
      (Data.Data.Data d_aWe, Data.Data.Data e_aWf) =>
      c_aWc (t_aWd d_aWe e_aWf))
     -> Data.Maybe.Maybe (c_aWc CompanyDatatypes.Employee)
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType AA,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ (@ (c_a1rt :: * -> *)) (@ (t_a1ru :: * -> * -> *)) _ _ ->
                 Data.Maybe.Nothing @ (c_a1rt CompanyDatatypes.Employee)}]
CompanyDatatypes.$fDataEmployee_$cdataCast2 =
  \ (@ (c_a1rt :: * -> *)) (@ (t_a1ru :: * -> * -> *)) _ _ ->
    Data.Maybe.Nothing @ (c_a1rt CompanyDatatypes.Employee)

CompanyDatatypes.$fDataEmployee_$cdataCast1
  :: forall (c_aVp :: * -> *) (t_aVq :: * -> *).
     Data.Typeable.Internal.Typeable1 t_aVq =>
     (forall d_aVr. Data.Data.Data d_aVr => c_aVp (t_aVq d_aVr))
     -> Data.Maybe.Maybe (c_aVp CompanyDatatypes.Employee)
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType AA,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ (@ (c_a1rB :: * -> *)) (@ (t_a1rC :: * -> *)) _ _ ->
                 Data.Maybe.Nothing @ (c_a1rB CompanyDatatypes.Employee)}]
CompanyDatatypes.$fDataEmployee_$cdataCast1 =
  \ (@ (c_a1rB :: * -> *)) (@ (t_a1rC :: * -> *)) _ _ ->
    Data.Maybe.Nothing @ (c_a1rB CompanyDatatypes.Employee)

CompanyDatatypes.$fDataEmployee [InlPrag=[ALWAYS] CONLIKE]
  :: Data.Data.Data CompanyDatatypes.Employee
[GblId[DFunId],
 Str=DmdType,
 Unf=DFun(arity=0) Data.Data.D:Data [{CompanyDatatypes.$fTypeableEmployee},
                                     {CompanyDatatypes.$fDataEmployee_$cgfoldl},
                                     {CompanyDatatypes.$fDataEmployee_$cgunfold},
                                     {CompanyDatatypes.$fDataEmployee_$ctoConstr},
                                     {CompanyDatatypes.$fDataEmployee_$cdataTypeOf},
                                     {CompanyDatatypes.$fDataEmployee_$cdataCast1},
                                     {CompanyDatatypes.$fDataEmployee_$cdataCast2},
                                     {CompanyDatatypes.$fDataEmployee_$cgmapT},
                                     {CompanyDatatypes.$fDataEmployee_$cgmapQl},
                                     {CompanyDatatypes.$fDataEmployee_$cgmapQr},
                                     {CompanyDatatypes.$fDataEmployee_$cgmapQ},
                                     {CompanyDatatypes.$fDataEmployee_$cgmapQi},
                                     {CompanyDatatypes.$fDataEmployee_$cgmapM},
                                     {CompanyDatatypes.$fDataEmployee_$cgmapMp},
                                     {CompanyDatatypes.$fDataEmployee_$cgmapMo}]]
CompanyDatatypes.$fDataEmployee =
  Data.Data.D:Data
    @ CompanyDatatypes.Employee
    (CompanyDatatypes.$fTypeableEmployee_$ctypeOf
     `cast` (Sym
               <(Data.Typeable.Internal.NTCo:Typeable
                   <CompanyDatatypes.Employee>)>
             :: (CompanyDatatypes.Employee -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable CompanyDatatypes.Employee))
    CompanyDatatypes.$fDataEmployee_$cgfoldl
    CompanyDatatypes.$fDataEmployee_$cgunfold
    CompanyDatatypes.$fDataEmployee_$ctoConstr
    CompanyDatatypes.$fDataEmployee_$cdataTypeOf
    CompanyDatatypes.$fDataEmployee_$cdataCast1
    CompanyDatatypes.$fDataEmployee_$cdataCast2
    CompanyDatatypes.$fDataEmployee_$cgmapT
    CompanyDatatypes.$fDataEmployee_$cgmapQl
    CompanyDatatypes.$fDataEmployee_$cgmapQr
    CompanyDatatypes.$fDataEmployee_$cgmapQ
    CompanyDatatypes.$fDataEmployee_$cgmapQi
    CompanyDatatypes.$fDataEmployee_$cgmapM
    CompanyDatatypes.$fDataEmployee_$cgmapMp
    CompanyDatatypes.$fDataEmployee_$cgmapMo

CompanyDatatypes.$fDataDept1
  :: [CompanyDatatypes.Unit] -> Data.Typeable.Internal.TypeRep
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 30 0}]
CompanyDatatypes.$fDataDept1 =
  Data.Typeable.Internal.typeOfDefault
    @ []
    @ CompanyDatatypes.Unit
    (Data.Typeable.Internal.$fTypeable1[]_$ctypeOf1
     `cast` (Sym <(Data.Typeable.Internal.NTCo:Typeable1 <[]>)>
             :: (forall a_a1GP. [a_a1GP] -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable1 []))
    (CompanyDatatypes.$fTypeableUnit_$ctypeOf
     `cast` (Sym
               <(Data.Typeable.Internal.NTCo:Typeable <CompanyDatatypes.Unit>)>
             :: (CompanyDatatypes.Unit -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable CompanyDatatypes.Unit))

$dData_r3dT :: Data.Data.Data CompanyDatatypes.Name
[GblId, Str=DmdType]
$dData_r3dT =
  Data.Data.$fData[]
    @ GHC.Types.Char
    (CompanyDatatypes.$fDataPerson2
     `cast` (Sym
               <(Data.Typeable.Internal.NTCo:Typeable <[GHC.Types.Char]>)>
             :: ([GHC.Types.Char] -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable [GHC.Types.Char]))
    Data.Data.$fDataChar

CompanyDatatypes.$fDataDept_$dData1
  :: Data.Data.Data CompanyDatatypes.Name
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 30 0}]
CompanyDatatypes.$fDataDept_$dData1 =
  Data.Data.$fData[]
    @ GHC.Types.Char
    (CompanyDatatypes.$fDataPerson2
     `cast` (Sym
               <(Data.Typeable.Internal.NTCo:Typeable <[GHC.Types.Char]>)>
             :: ([GHC.Types.Char] -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable [GHC.Types.Char]))
    Data.Data.$fDataChar

CompanyDatatypes.$fDataDept_$cdataCast2
  :: forall (c_aWc :: * -> *) (t_aWd :: * -> * -> *).
     Data.Typeable.Internal.Typeable2 t_aWd =>
     (forall d_aWe e_aWf.
      (Data.Data.Data d_aWe, Data.Data.Data e_aWf) =>
      c_aWc (t_aWd d_aWe e_aWf))
     -> Data.Maybe.Maybe (c_aWc CompanyDatatypes.Dept)
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType AA,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ (@ (c_a1rt :: * -> *)) (@ (t_a1ru :: * -> * -> *)) _ _ ->
                 Data.Maybe.Nothing @ (c_a1rt CompanyDatatypes.Dept)}]
CompanyDatatypes.$fDataDept_$cdataCast2 =
  \ (@ (c_a1rt :: * -> *)) (@ (t_a1ru :: * -> * -> *)) _ _ ->
    Data.Maybe.Nothing @ (c_a1rt CompanyDatatypes.Dept)

CompanyDatatypes.$fDataDept_$cdataCast1
  :: forall (c_aVp :: * -> *) (t_aVq :: * -> *).
     Data.Typeable.Internal.Typeable1 t_aVq =>
     (forall d_aVr. Data.Data.Data d_aVr => c_aVp (t_aVq d_aVr))
     -> Data.Maybe.Maybe (c_aVp CompanyDatatypes.Dept)
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType AA,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ (@ (c_a1rB :: * -> *)) (@ (t_a1rC :: * -> *)) _ _ ->
                 Data.Maybe.Nothing @ (c_a1rB CompanyDatatypes.Dept)}]
CompanyDatatypes.$fDataDept_$cdataCast1 =
  \ (@ (c_a1rB :: * -> *)) (@ (t_a1rC :: * -> *)) _ _ ->
    Data.Maybe.Nothing @ (c_a1rB CompanyDatatypes.Dept)

CompanyDatatypes.$fDataUnit_$cdataCast2
  :: forall (c_aWc :: * -> *) (t_aWd :: * -> * -> *).
     Data.Typeable.Internal.Typeable2 t_aWd =>
     (forall d_aWe e_aWf.
      (Data.Data.Data d_aWe, Data.Data.Data e_aWf) =>
      c_aWc (t_aWd d_aWe e_aWf))
     -> Data.Maybe.Maybe (c_aWc CompanyDatatypes.Unit)
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType AA,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ (@ (c_a1rt :: * -> *)) (@ (t_a1ru :: * -> * -> *)) _ _ ->
                 Data.Maybe.Nothing @ (c_a1rt CompanyDatatypes.Unit)}]
CompanyDatatypes.$fDataUnit_$cdataCast2 =
  \ (@ (c_a1rt :: * -> *)) (@ (t_a1ru :: * -> * -> *)) _ _ ->
    Data.Maybe.Nothing @ (c_a1rt CompanyDatatypes.Unit)

CompanyDatatypes.$fDataUnit_$cdataCast1
  :: forall (c_aVp :: * -> *) (t_aVq :: * -> *).
     Data.Typeable.Internal.Typeable1 t_aVq =>
     (forall d_aVr. Data.Data.Data d_aVr => c_aVp (t_aVq d_aVr))
     -> Data.Maybe.Maybe (c_aVp CompanyDatatypes.Unit)
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType AA,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ (@ (c_a1rB :: * -> *)) (@ (t_a1rC :: * -> *)) _ _ ->
                 Data.Maybe.Nothing @ (c_a1rB CompanyDatatypes.Unit)}]
CompanyDatatypes.$fDataUnit_$cdataCast1 =
  \ (@ (c_a1rB :: * -> *)) (@ (t_a1rC :: * -> *)) _ _ ->
    Data.Maybe.Nothing @ (c_a1rB CompanyDatatypes.Unit)

lvl8_r3dU
  :: (CompanyDatatypes.Employee -> CompanyDatatypes.Unit,
      GHC.Types.Bool)
[GblId, Caf=NoCafRefs]
lvl8_r3dU = (CompanyDatatypes.PU, GHC.Types.False)

lvl9_r3dV
  :: (CompanyDatatypes.Dept -> CompanyDatatypes.Unit, GHC.Types.Bool)
[GblId, Caf=NoCafRefs]
lvl9_r3dV = (CompanyDatatypes.DU, GHC.Types.False)

lvl10_r3dW
  :: (CompanyDatatypes.Name
      -> CompanyDatatypes.Manager
      -> [CompanyDatatypes.Unit]
      -> CompanyDatatypes.Dept,
      GHC.Types.Bool)
[GblId, Caf=NoCafRefs]
lvl10_r3dW = (CompanyDatatypes.D, GHC.Types.False)

Rec {
CompanyDatatypes.$fDataUnit_$cgunfold [InlPrag=INLINE[0]]
  :: forall (c_aV9 :: * -> *).
     (forall b_aVa r_aVb.
      Data.Data.Data b_aVa =>
      c_aV9 (b_aVa -> r_aVb) -> c_aV9 r_aVb)
     -> (forall r_aVc. r_aVc -> c_aV9 r_aVc)
     -> Data.Data.Constr
     -> c_aV9 CompanyDatatypes.Unit
[GblId,
 Arity=3,
 Str=DmdType C(C(S))LU(SAAAA),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgunfold, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (c_aV9 :: * -> *))
                 (w_s2l0 [Occ=Once]
                    :: forall b_aVa r_aVb.
                       Data.Data.Data b_aVa =>
                       c_aV9 (b_aVa -> r_aVb) -> c_aV9 r_aVb)
                 (w3_s2l1 [Occ=Once] :: forall r_aVc. r_aVc -> c_aV9 r_aVc)
                 (w4_s2l2 [Occ=Once!] :: Data.Data.Constr) ->
                 case w4_s2l2 of _ { Data.Data.Constr ww_s2l4 [Occ=Once] _ _ _ _ ->
                 CompanyDatatypes.$w$cgunfold @ c_aV9 w_s2l0 w3_s2l1 ww_s2l4
                 }}]
CompanyDatatypes.$fDataUnit_$cgunfold =
  \ (@ (c_aV9 :: * -> *))
    (w_s2l0
       :: forall b_aVa r_aVb.
          Data.Data.Data b_aVa =>
          c_aV9 (b_aVa -> r_aVb) -> c_aV9 r_aVb)
    (w3_s2l1 :: forall r_aVc. r_aVc -> c_aV9 r_aVc)
    (w4_s2l2 :: Data.Data.Constr) ->
    case w4_s2l2
    of _
    { Data.Data.Constr ww_s2l4 ww1_s2l5 ww2_s2l6 ww3_s2l7 ww4_s2l8 ->
    CompanyDatatypes.$w$cgunfold @ c_aV9 w_s2l0 w3_s2l1 ww_s2l4
    }

CompanyDatatypes.$fDataDept_$cgmapMo [InlPrag=INLINE[0]]
  :: forall (m_aY8 :: * -> *).
     Control.Monad.MonadPlus m_aY8 =>
     (forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
     -> CompanyDatatypes.Dept -> m_aY8 CompanyDatatypes.Dept
[GblId,
 Arity=3,
 Str=DmdType U(SLL)LL,
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapMo1, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (m_aY8 :: * -> *))
                 (w_s2lk [Occ=Once!] :: Control.Monad.MonadPlus m_aY8)
                 (w3_s2lq [Occ=Once]
                    :: forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
                 (w4_s2lr [Occ=Once] :: CompanyDatatypes.Dept) ->
                 case w_s2lk
                 of _
                 { Control.Monad.D:MonadPlus ww_s2lm [Occ=Once]
                                             ww1_s2ln [Occ=Once]
                                             ww2_s2lo [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapMo1
                   @ m_aY8 ww_s2lm ww1_s2ln ww2_s2lo w3_s2lq w4_s2lr
                 }}]
CompanyDatatypes.$fDataDept_$cgmapMo =
  \ (@ (m_aY8 :: * -> *))
    (w_s2lk :: Control.Monad.MonadPlus m_aY8)
    (w3_s2lq
       :: forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
    (w4_s2lr :: CompanyDatatypes.Dept) ->
    case w_s2lk
    of _ { Control.Monad.D:MonadPlus ww_s2lm ww1_s2ln ww2_s2lo ->
    CompanyDatatypes.$w$cgmapMo1
      @ m_aY8 ww_s2lm ww1_s2ln ww2_s2lo w3_s2lq w4_s2lr
    }

CompanyDatatypes.$fDataDept_$cgmapMp [InlPrag=INLINE[0]]
  :: forall (m_aXe :: * -> *).
     Control.Monad.MonadPlus m_aXe =>
     (forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
     -> CompanyDatatypes.Dept -> m_aXe CompanyDatatypes.Dept
[GblId,
 Arity=3,
 Str=DmdType U(SLL)LL,
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapMp, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (m_aXe :: * -> *))
                 (w_s2jb [Occ=Once!] :: Control.Monad.MonadPlus m_aXe)
                 (w3_s2jh [Occ=Once]
                    :: forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
                 (w4_s2ji [Occ=Once] :: CompanyDatatypes.Dept) ->
                 case w_s2jb
                 of _
                 { Control.Monad.D:MonadPlus ww_s2jd [Occ=Once]
                                             ww1_s2je [Occ=Once]
                                             ww2_s2jf [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapMp
                   @ m_aXe ww_s2jd ww1_s2je ww2_s2jf w3_s2jh w4_s2ji
                 }}]
CompanyDatatypes.$fDataDept_$cgmapMp =
  \ (@ (m_aXe :: * -> *))
    (w_s2jb :: Control.Monad.MonadPlus m_aXe)
    (w3_s2jh
       :: forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
    (w4_s2ji :: CompanyDatatypes.Dept) ->
    case w_s2jb
    of _ { Control.Monad.D:MonadPlus ww_s2jd ww1_s2je ww2_s2jf ->
    CompanyDatatypes.$w$cgmapMp
      @ m_aXe ww_s2jd ww1_s2je ww2_s2jf w3_s2jh w4_s2ji
    }

CompanyDatatypes.$fDataDept_$cgmapM [InlPrag=INLINE[0]]
  :: forall (m_aX4 :: * -> *).
     GHC.Base.Monad m_aX4 =>
     (forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
     -> CompanyDatatypes.Dept -> m_aX4 CompanyDatatypes.Dept
[GblId,
 Arity=3,
 Str=DmdType U(SALA)LU(LLL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapM, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (m_aX4 :: * -> *))
                 (w_s2jn [Occ=Once!] :: GHC.Base.Monad m_aX4)
                 (w3_s2ju [Occ=Once]
                    :: forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
                 (w4_s2jv [Occ=Once!] :: CompanyDatatypes.Dept) ->
                 case w_s2jn
                 of _
                 { GHC.Base.D:Monad ww_s2jp [Occ=Once] _ ww2_s2jr [Occ=Once] _ ->
                 case w4_s2jv
                 of _
                 { CompanyDatatypes.D ww4_s2jx [Occ=Once]
                                      ww5_s2jy [Occ=Once]
                                      ww6_s2jz [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapM
                   @ m_aX4 ww_s2jp ww2_s2jr w3_s2ju ww4_s2jx ww5_s2jy ww6_s2jz
                 }
                 }}]
CompanyDatatypes.$fDataDept_$cgmapM =
  \ (@ (m_aX4 :: * -> *))
    (w_s2jn :: GHC.Base.Monad m_aX4)
    (w3_s2ju
       :: forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
    (w4_s2jv :: CompanyDatatypes.Dept) ->
    case w_s2jn
    of _ { GHC.Base.D:Monad ww_s2jp ww1_s2jq ww2_s2jr ww3_s2js ->
    case w4_s2jv
    of _ { CompanyDatatypes.D ww4_s2jx ww5_s2jy ww6_s2jz ->
    CompanyDatatypes.$w$cgmapM
      @ m_aX4 ww_s2jp ww2_s2jr w3_s2ju ww4_s2jx ww5_s2jy ww6_s2jz
    }
    }

CompanyDatatypes.$fDataDept_$cgmapQi [InlPrag=INLINE[0]]
  :: forall u_aWW.
     GHC.Types.Int
     -> (forall d_aWX. Data.Data.Data d_aWX => d_aWX -> u_aWW)
     -> CompanyDatatypes.Dept
     -> u_aWW
[GblId,
 Arity=3,
 Str=DmdType U(L)C(C(S))U(LLL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapQi, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ u_aWW)
                 (w_s2jF [Occ=Once!] :: GHC.Types.Int)
                 (w3_s2jJ [Occ=Once]
                    :: forall d_aWX. Data.Data.Data d_aWX => d_aWX -> u_aWW)
                 (w4_s2jK [Occ=Once!] :: CompanyDatatypes.Dept) ->
                 case w_s2jF of _ { GHC.Types.I# ww_s2jH [Occ=Once] ->
                 case w4_s2jK
                 of _
                 { CompanyDatatypes.D ww1_s2jM [Occ=Once]
                                      ww2_s2jN [Occ=Once]
                                      ww3_s2jO [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapQi
                   @ u_aWW ww_s2jH w3_s2jJ ww1_s2jM ww2_s2jN ww3_s2jO
                 }
                 }}]
CompanyDatatypes.$fDataDept_$cgmapQi =
  \ (@ u_aWW)
    (w_s2jF :: GHC.Types.Int)
    (w3_s2jJ :: forall d_aWX. Data.Data.Data d_aWX => d_aWX -> u_aWW)
    (w4_s2jK :: CompanyDatatypes.Dept) ->
    case w_s2jF of _ { GHC.Types.I# ww_s2jH ->
    case w4_s2jK
    of _ { CompanyDatatypes.D ww1_s2jM ww2_s2jN ww3_s2jO ->
    CompanyDatatypes.$w$cgmapQi
      @ u_aWW ww_s2jH w3_s2jJ ww1_s2jM ww2_s2jN ww3_s2jO
    }
    }

CompanyDatatypes.$fDataDept_$cgmapQ [InlPrag=INLINE[0]]
  :: forall u_aWO.
     (forall d_aWP. Data.Data.Data d_aWP => d_aWP -> u_aWO)
     -> CompanyDatatypes.Dept -> [u_aWO]
[GblId,
 Arity=2,
 Str=DmdType LU(LLL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapQ, TopLvl=True,
         Arity=2, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ u_aWO)
                 (w_s2jT [Occ=Once]
                    :: forall d_aWP. Data.Data.Data d_aWP => d_aWP -> u_aWO)
                 (w3_s2jU [Occ=Once!] :: CompanyDatatypes.Dept) ->
                 case w3_s2jU
                 of _
                 { CompanyDatatypes.D ww_s2jW [Occ=Once]
                                      ww1_s2jX [Occ=Once]
                                      ww2_s2jY [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapQ @ u_aWO w_s2jT ww_s2jW ww1_s2jX ww2_s2jY
                 }}]
CompanyDatatypes.$fDataDept_$cgmapQ =
  \ (@ u_aWO)
    (w_s2jT :: forall d_aWP. Data.Data.Data d_aWP => d_aWP -> u_aWO)
    (w3_s2jU :: CompanyDatatypes.Dept) ->
    case w3_s2jU of _ { CompanyDatatypes.D ww_s2jW ww1_s2jX ww2_s2jY ->
    CompanyDatatypes.$w$cgmapQ @ u_aWO w_s2jT ww_s2jW ww1_s2jX ww2_s2jY
    }

CompanyDatatypes.$fDataDept_$cgmapQr [InlPrag=INLINE[0]]
  :: forall r_aWE r'_aWF.
     (r'_aWF -> r_aWE -> r_aWE)
     -> r_aWE
     -> (forall d_aWG. Data.Data.Data d_aWG => d_aWG -> r'_aWF)
     -> CompanyDatatypes.Dept
     -> r_aWE
[GblId,
 Arity=4,
 Str=DmdType C(C(S))LLU(LLL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapQr, TopLvl=True,
         Arity=4, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ r_aWE)
                 (@ r'_aWF)
                 (w_s2k5 [Occ=Once] :: r'_aWF -> r_aWE -> r_aWE)
                 (w3_s2k6 [Occ=Once] :: r_aWE)
                 (w4_s2k7 [Occ=Once]
                    :: forall d_aWG. Data.Data.Data d_aWG => d_aWG -> r'_aWF)
                 (w5_s2k8 [Occ=Once!] :: CompanyDatatypes.Dept) ->
                 case w5_s2k8
                 of _
                 { CompanyDatatypes.D ww_s2ka [Occ=Once]
                                      ww1_s2kb [Occ=Once]
                                      ww2_s2kc [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapQr
                   @ r_aWE @ r'_aWF w_s2k5 w3_s2k6 w4_s2k7 ww_s2ka ww1_s2kb ww2_s2kc
                 }}]
CompanyDatatypes.$fDataDept_$cgmapQr =
  \ (@ r_aWE)
    (@ r'_aWF)
    (w_s2k5 :: r'_aWF -> r_aWE -> r_aWE)
    (w3_s2k6 :: r_aWE)
    (w4_s2k7 :: forall d_aWG. Data.Data.Data d_aWG => d_aWG -> r'_aWF)
    (w5_s2k8 :: CompanyDatatypes.Dept) ->
    case w5_s2k8 of _ { CompanyDatatypes.D ww_s2ka ww1_s2kb ww2_s2kc ->
    CompanyDatatypes.$w$cgmapQr
      @ r_aWE @ r'_aWF w_s2k5 w3_s2k6 w4_s2k7 ww_s2ka ww1_s2kb ww2_s2kc
    }

CompanyDatatypes.$fDataDept_$cgmapQl [InlPrag=INLINE[0]]
  :: forall r_aWu r'_aWv.
     (r_aWu -> r'_aWv -> r_aWu)
     -> r_aWu
     -> (forall d_aWw. Data.Data.Data d_aWw => d_aWw -> r'_aWv)
     -> CompanyDatatypes.Dept
     -> r_aWu
[GblId,
 Arity=4,
 Str=DmdType C(C(S))LLU(LLL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapQl, TopLvl=True,
         Arity=4, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ r_aWu)
                 (@ r'_aWv)
                 (w_s2kj [Occ=Once] :: r_aWu -> r'_aWv -> r_aWu)
                 (w3_s2kk [Occ=Once] :: r_aWu)
                 (w4_s2kl [Occ=Once]
                    :: forall d_aWw. Data.Data.Data d_aWw => d_aWw -> r'_aWv)
                 (w5_s2km [Occ=Once!] :: CompanyDatatypes.Dept) ->
                 case w5_s2km
                 of _
                 { CompanyDatatypes.D ww_s2ko [Occ=Once]
                                      ww1_s2kp [Occ=Once]
                                      ww2_s2kq [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapQl
                   @ r_aWu @ r'_aWv w_s2kj w3_s2kk w4_s2kl ww_s2ko ww1_s2kp ww2_s2kq
                 }}]
CompanyDatatypes.$fDataDept_$cgmapQl =
  \ (@ r_aWu)
    (@ r'_aWv)
    (w_s2kj :: r_aWu -> r'_aWv -> r_aWu)
    (w3_s2kk :: r_aWu)
    (w4_s2kl :: forall d_aWw. Data.Data.Data d_aWw => d_aWw -> r'_aWv)
    (w5_s2km :: CompanyDatatypes.Dept) ->
    case w5_s2km of _ { CompanyDatatypes.D ww_s2ko ww1_s2kp ww2_s2kq ->
    CompanyDatatypes.$w$cgmapQl
      @ r_aWu @ r'_aWv w_s2kj w3_s2kk w4_s2kl ww_s2ko ww1_s2kp ww2_s2kq
    }

CompanyDatatypes.$fDataDept_$cgunfold [InlPrag=INLINE[0]]
  :: forall (c_aV9 :: * -> *).
     (forall b_aVa r_aVb.
      Data.Data.Data b_aVa =>
      c_aV9 (b_aVa -> r_aVb) -> c_aV9 r_aVb)
     -> (forall r_aVc. r_aVc -> c_aV9 r_aVc)
     -> Data.Data.Constr
     -> c_aV9 CompanyDatatypes.Dept
[GblId,
 Arity=3,
 Str=DmdType C(C(S))LA,
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgunfold1, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ (@ (c_aV9 :: * -> *))
                 (w_s2kH [Occ=Once]
                    :: forall b_aVa r_aVb.
                       Data.Data.Data b_aVa =>
                       c_aV9 (b_aVa -> r_aVb) -> c_aV9 r_aVb)
                 (w3_s2kI [Occ=Once] :: forall r_aVc. r_aVc -> c_aV9 r_aVc)
                 _ ->
                 CompanyDatatypes.$w$cgunfold1 @ c_aV9 w_s2kH w3_s2kI}]
CompanyDatatypes.$fDataDept_$cgunfold =
  \ (@ (c_aV9 :: * -> *))
    (w_s2kH
       :: forall b_aVa r_aVb.
          Data.Data.Data b_aVa =>
          c_aV9 (b_aVa -> r_aVb) -> c_aV9 r_aVb)
    (w3_s2kI :: forall r_aVc. r_aVc -> c_aV9 r_aVc)
    _ ->
    CompanyDatatypes.$w$cgunfold1 @ c_aV9 w_s2kH w3_s2kI

CompanyDatatypes.$fDataDept_$cgfoldl [InlPrag=INLINE[0]]
  :: forall (c_aV0 :: * -> *).
     (forall d_aV1 b_aV2.
      Data.Data.Data d_aV1 =>
      c_aV0 (d_aV1 -> b_aV2) -> d_aV1 -> c_aV0 b_aV2)
     -> (forall g_aV3. g_aV3 -> c_aV0 g_aV3)
     -> CompanyDatatypes.Dept
     -> c_aV0 CompanyDatatypes.Dept
[GblId,
 Arity=3,
 Str=DmdType C(C(C(S)))LU(LLL),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgfoldl2, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (c_aV0 :: * -> *))
                 (w_s2kO [Occ=Once]
                    :: forall d_aV1 b_aV2.
                       Data.Data.Data d_aV1 =>
                       c_aV0 (d_aV1 -> b_aV2) -> d_aV1 -> c_aV0 b_aV2)
                 (w3_s2kP [Occ=Once] :: forall g_aV3. g_aV3 -> c_aV0 g_aV3)
                 (w4_s2kQ [Occ=Once!] :: CompanyDatatypes.Dept) ->
                 case w4_s2kQ
                 of _
                 { CompanyDatatypes.D ww_s2kS [Occ=Once]
                                      ww1_s2kT [Occ=Once]
                                      ww2_s2kU [Occ=Once] ->
                 CompanyDatatypes.$w$cgfoldl2
                   @ c_aV0 w_s2kO w3_s2kP ww_s2kS ww1_s2kT ww2_s2kU
                 }}]
CompanyDatatypes.$fDataDept_$cgfoldl =
  \ (@ (c_aV0 :: * -> *))
    (w_s2kO
       :: forall d_aV1 b_aV2.
          Data.Data.Data d_aV1 =>
          c_aV0 (d_aV1 -> b_aV2) -> d_aV1 -> c_aV0 b_aV2)
    (w3_s2kP :: forall g_aV3. g_aV3 -> c_aV0 g_aV3)
    (w4_s2kQ :: CompanyDatatypes.Dept) ->
    case w4_s2kQ of _ { CompanyDatatypes.D ww_s2kS ww1_s2kT ww2_s2kU ->
    CompanyDatatypes.$w$cgfoldl2
      @ c_aV0 w_s2kO w3_s2kP ww_s2kS ww1_s2kT ww2_s2kU
    }

CompanyDatatypes.$fDataUnit_$cgmapMo [InlPrag=INLINE[0]]
  :: forall (m_aY8 :: * -> *).
     Control.Monad.MonadPlus m_aY8 =>
     (forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
     -> CompanyDatatypes.Unit -> m_aY8 CompanyDatatypes.Unit
[GblId,
 Arity=3,
 Str=DmdType U(SLL)LL,
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapMo2, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (m_aY8 :: * -> *))
                 (w_s2io [Occ=Once!] :: Control.Monad.MonadPlus m_aY8)
                 (w3_s2iu [Occ=Once]
                    :: forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
                 (w4_s2iv [Occ=Once] :: CompanyDatatypes.Unit) ->
                 case w_s2io
                 of _
                 { Control.Monad.D:MonadPlus ww_s2iq [Occ=Once]
                                             ww1_s2ir [Occ=Once]
                                             ww2_s2is [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapMo2
                   @ m_aY8 ww_s2iq ww1_s2ir ww2_s2is w3_s2iu w4_s2iv
                 }}]
CompanyDatatypes.$fDataUnit_$cgmapMo =
  \ (@ (m_aY8 :: * -> *))
    (w_s2io :: Control.Monad.MonadPlus m_aY8)
    (w3_s2iu
       :: forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
    (w4_s2iv :: CompanyDatatypes.Unit) ->
    case w_s2io
    of _ { Control.Monad.D:MonadPlus ww_s2iq ww1_s2ir ww2_s2is ->
    CompanyDatatypes.$w$cgmapMo2
      @ m_aY8 ww_s2iq ww1_s2ir ww2_s2is w3_s2iu w4_s2iv
    }

CompanyDatatypes.$fDataUnit_$cgmapMp [InlPrag=INLINE[0]]
  :: forall (m_aXe :: * -> *).
     Control.Monad.MonadPlus m_aXe =>
     (forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
     -> CompanyDatatypes.Unit -> m_aXe CompanyDatatypes.Unit
[GblId,
 Arity=3,
 Str=DmdType U(SLL)LL,
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapMp1, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (m_aXe :: * -> *))
                 (w_s2iG [Occ=Once!] :: Control.Monad.MonadPlus m_aXe)
                 (w3_s2iM [Occ=Once]
                    :: forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
                 (w4_s2iN [Occ=Once] :: CompanyDatatypes.Unit) ->
                 case w_s2iG
                 of _
                 { Control.Monad.D:MonadPlus ww_s2iI [Occ=Once]
                                             ww1_s2iJ [Occ=Once]
                                             ww2_s2iK [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapMp1
                   @ m_aXe ww_s2iI ww1_s2iJ ww2_s2iK w3_s2iM w4_s2iN
                 }}]
CompanyDatatypes.$fDataUnit_$cgmapMp =
  \ (@ (m_aXe :: * -> *))
    (w_s2iG :: Control.Monad.MonadPlus m_aXe)
    (w3_s2iM
       :: forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
    (w4_s2iN :: CompanyDatatypes.Unit) ->
    case w_s2iG
    of _ { Control.Monad.D:MonadPlus ww_s2iI ww1_s2iJ ww2_s2iK ->
    CompanyDatatypes.$w$cgmapMp1
      @ m_aXe ww_s2iI ww1_s2iJ ww2_s2iK w3_s2iM w4_s2iN
    }

CompanyDatatypes.$fDataUnit_$cgmapM [InlPrag=INLINE[0]]
  :: forall (m_aX4 :: * -> *).
     GHC.Base.Monad m_aX4 =>
     (forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
     -> CompanyDatatypes.Unit -> m_aX4 CompanyDatatypes.Unit
[GblId,
 Arity=3,
 Str=DmdType U(SALA)LS,
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapM1, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (m_aX4 :: * -> *))
                 (w_s2iS [Occ=Once!] :: GHC.Base.Monad m_aX4)
                 (w3_s2iZ [Occ=Once]
                    :: forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
                 (w4_s2j0 [Occ=Once] :: CompanyDatatypes.Unit) ->
                 case w_s2iS
                 of _
                 { GHC.Base.D:Monad ww_s2iU [Occ=Once] _ ww2_s2iW [Occ=Once] _ ->
                 CompanyDatatypes.$w$cgmapM1
                   @ m_aX4 ww_s2iU ww2_s2iW w3_s2iZ w4_s2j0
                 }}]
CompanyDatatypes.$fDataUnit_$cgmapM =
  \ (@ (m_aX4 :: * -> *))
    (w_s2iS :: GHC.Base.Monad m_aX4)
    (w3_s2iZ
       :: forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
    (w4_s2j0 :: CompanyDatatypes.Unit) ->
    case w_s2iS
    of _ { GHC.Base.D:Monad ww_s2iU ww1_s2iV ww2_s2iW ww3_s2iX ->
    CompanyDatatypes.$w$cgmapM1
      @ m_aX4 ww_s2iU ww2_s2iW w3_s2iZ w4_s2j0
    }

CompanyDatatypes.$fDataUnit_$cgmapQl
  :: forall r_aWu r'_aWv.
     (r_aWu -> r'_aWv -> r_aWu)
     -> r_aWu
     -> (forall d_aWw. Data.Data.Data d_aWw => d_aWw -> r'_aWv)
     -> CompanyDatatypes.Unit
     -> r_aWu
[GblId,
 Arity=4,
 Str=DmdType C(C(S))LLS,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)}]
CompanyDatatypes.$fDataUnit_$cgmapQl =
  CompanyDatatypes.$fDataUnit1
  `cast` (forall r_a1qt r'_a1qu.
          <r_a1qt -> r'_a1qu -> r_a1qt>
          -> <r_a1qt>
          -> <forall d_a1qy. Data.Data.Data d_a1qy => d_a1qy -> r'_a1qu>
          -> <CompanyDatatypes.Unit>
          -> <Data.Data.NTCo:CONST <r_a1qt> <CompanyDatatypes.Unit>>
          :: (forall r_a1qt r'_a1qu.
              (r_a1qt -> r'_a1qu -> r_a1qt)
              -> r_a1qt
              -> (forall d_a1qy. Data.Data.Data d_a1qy => d_a1qy -> r'_a1qu)
              -> CompanyDatatypes.Unit
              -> Data.Data.CONST r_a1qt CompanyDatatypes.Unit)
               ~#
             (forall r_a1qt r'_a1qu.
              (r_a1qt -> r'_a1qu -> r_a1qt)
              -> r_a1qt
              -> (forall d_a1qy. Data.Data.Data d_a1qy => d_a1qy -> r'_a1qu)
              -> CompanyDatatypes.Unit
              -> r_a1qt))

CompanyDatatypes.$fDataUnit_$cgmapT
  :: (forall b_aWo. Data.Data.Data b_aWo => b_aWo -> b_aWo)
     -> CompanyDatatypes.Unit -> CompanyDatatypes.Unit
[GblId,
 Arity=2,
 Str=DmdType LS,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)}]
CompanyDatatypes.$fDataUnit_$cgmapT =
  CompanyDatatypes.$fDataUnit2
  `cast` (<forall b_a1r8. Data.Data.Data b_a1r8 => b_a1r8 -> b_a1r8>
          -> <CompanyDatatypes.Unit>
          -> <Data.Data.NTCo:ID <CompanyDatatypes.Unit>>
          :: ((forall b_a1r8. Data.Data.Data b_a1r8 => b_a1r8 -> b_a1r8)
              -> CompanyDatatypes.Unit -> Data.Data.ID CompanyDatatypes.Unit)
               ~#
             ((forall b_a1r8. Data.Data.Data b_a1r8 => b_a1r8 -> b_a1r8)
              -> CompanyDatatypes.Unit -> CompanyDatatypes.Unit))

CompanyDatatypes.$fDataUnit [InlPrag=[ALWAYS] CONLIKE]
  :: Data.Data.Data CompanyDatatypes.Unit
[GblId[DFunId],
 Str=DmdType,
 Unf=DFun(arity=0) Data.Data.D:Data [{CompanyDatatypes.$fTypeableUnit},
                                     {CompanyDatatypes.$fDataUnit_$cgfoldl},
                                     {CompanyDatatypes.$fDataUnit_$cgunfold},
                                     {CompanyDatatypes.$fDataUnit_$ctoConstr},
                                     {CompanyDatatypes.$fDataUnit_$cdataTypeOf},
                                     {CompanyDatatypes.$fDataUnit_$cdataCast1},
                                     {CompanyDatatypes.$fDataUnit_$cdataCast2},
                                     {CompanyDatatypes.$fDataUnit_$cgmapT},
                                     {CompanyDatatypes.$fDataUnit_$cgmapQl},
                                     {CompanyDatatypes.$fDataUnit_$cgmapQr},
                                     {CompanyDatatypes.$fDataUnit_$cgmapQ},
                                     {CompanyDatatypes.$fDataUnit_$cgmapQi},
                                     {CompanyDatatypes.$fDataUnit_$cgmapM},
                                     {CompanyDatatypes.$fDataUnit_$cgmapMp},
                                     {CompanyDatatypes.$fDataUnit_$cgmapMo}]]
CompanyDatatypes.$fDataUnit =
  Data.Data.D:Data
    @ CompanyDatatypes.Unit
    (CompanyDatatypes.$fTypeableUnit_$ctypeOf
     `cast` (Sym
               <(Data.Typeable.Internal.NTCo:Typeable <CompanyDatatypes.Unit>)>
             :: (CompanyDatatypes.Unit -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable CompanyDatatypes.Unit))
    CompanyDatatypes.$fDataUnit_$cgfoldl
    CompanyDatatypes.$fDataUnit_$cgunfold
    CompanyDatatypes.$fDataUnit_$ctoConstr
    CompanyDatatypes.$fDataUnit_$cdataTypeOf
    CompanyDatatypes.$fDataUnit_$cdataCast1
    CompanyDatatypes.$fDataUnit_$cdataCast2
    (CompanyDatatypes.$fDataUnit2
     `cast` (<forall b_a1r8. Data.Data.Data b_a1r8 => b_a1r8 -> b_a1r8>
             -> <CompanyDatatypes.Unit>
             -> <Data.Data.NTCo:ID <CompanyDatatypes.Unit>>
             :: ((forall b_a1r8. Data.Data.Data b_a1r8 => b_a1r8 -> b_a1r8)
                 -> CompanyDatatypes.Unit -> Data.Data.ID CompanyDatatypes.Unit)
                  ~#
                ((forall b_a1r8. Data.Data.Data b_a1r8 => b_a1r8 -> b_a1r8)
                 -> CompanyDatatypes.Unit -> CompanyDatatypes.Unit)))
    (CompanyDatatypes.$fDataUnit1
     `cast` (forall r_X1Cv r'_X1Cx.
             <r_X1Cv -> r'_X1Cx -> r_X1Cv>
             -> <r_X1Cv>
             -> <forall d_a1qy. Data.Data.Data d_a1qy => d_a1qy -> r'_X1Cx>
             -> <CompanyDatatypes.Unit>
             -> <Data.Data.NTCo:CONST <r_X1Cv> <CompanyDatatypes.Unit>>
             :: (forall r_X1Cv r'_X1Cx.
                 (r_X1Cv -> r'_X1Cx -> r_X1Cv)
                 -> r_X1Cv
                 -> (forall d_a1qy. Data.Data.Data d_a1qy => d_a1qy -> r'_X1Cx)
                 -> CompanyDatatypes.Unit
                 -> Data.Data.CONST r_X1Cv CompanyDatatypes.Unit)
                  ~#
                (forall r_X1Cv r'_X1Cx.
                 (r_X1Cv -> r'_X1Cx -> r_X1Cv)
                 -> r_X1Cv
                 -> (forall d_a1qy. Data.Data.Data d_a1qy => d_a1qy -> r'_X1Cx)
                 -> CompanyDatatypes.Unit
                 -> r_X1Cv)))
    CompanyDatatypes.$fDataUnit_$cgmapQr
    CompanyDatatypes.$fDataUnit_$cgmapQ
    CompanyDatatypes.$fDataUnit_$cgmapQi
    CompanyDatatypes.$fDataUnit_$cgmapM
    CompanyDatatypes.$fDataUnit_$cgmapMp
    CompanyDatatypes.$fDataUnit_$cgmapMo

CompanyDatatypes.$fDataDept_$dData
  :: Data.Data.Data [CompanyDatatypes.Unit]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 30 0}]
CompanyDatatypes.$fDataDept_$dData =
  Data.Data.$fData[]
    @ CompanyDatatypes.Unit
    (CompanyDatatypes.$fDataDept1
     `cast` (Sym
               <(Data.Typeable.Internal.NTCo:Typeable <[CompanyDatatypes.Unit]>)>
             :: ([CompanyDatatypes.Unit] -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable [CompanyDatatypes.Unit]))
    CompanyDatatypes.$fDataUnit

CompanyDatatypes.$fDataDept_$cgmapT [InlPrag=INLINE[0]]
  :: (forall b_aWo. Data.Data.Data b_aWo => b_aWo -> b_aWo)
     -> CompanyDatatypes.Dept -> CompanyDatatypes.Dept
[GblId,
 Arity=2,
 Str=DmdType LU(LLL)m,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (w_s2kv
                    :: forall b_aWo. Data.Data.Data b_aWo => b_aWo -> b_aWo)
                 (w3_s2kw [Occ=Once!] :: CompanyDatatypes.Dept) ->
                 case w3_s2kw
                 of _
                 { CompanyDatatypes.D ww_s2ky [Occ=Once]
                                      ww1_s2kz [Occ=Once]
                                      ww2_s2kA [Occ=Once] ->
                 CompanyDatatypes.D
                   (w_s2kv
                      @ CompanyDatatypes.Name
                      CompanyDatatypes.$fDataDept_$dData1
                      ww_s2ky)
                   (w_s2kv
                      @ CompanyDatatypes.Manager
                      CompanyDatatypes.$fDataEmployee
                      ww1_s2kz)
                   (w_s2kv
                      @ [CompanyDatatypes.Unit]
                      CompanyDatatypes.$fDataDept_$dData
                      ww2_s2kA)
                 }}]
CompanyDatatypes.$fDataDept_$cgmapT =
  \ (w_s2kv :: forall b_aWo. Data.Data.Data b_aWo => b_aWo -> b_aWo)
    (w3_s2kw :: CompanyDatatypes.Dept) ->
    case w3_s2kw of _ { CompanyDatatypes.D ww_s2ky ww1_s2kz ww2_s2kA ->
    CompanyDatatypes.D
      (w_s2kv
         @ CompanyDatatypes.Name
         CompanyDatatypes.$fDataDept_$dData1
         ww_s2ky)
      (w_s2kv
         @ CompanyDatatypes.Manager
         CompanyDatatypes.$fDataEmployee
         ww1_s2kz)
      (w_s2kv
         @ [CompanyDatatypes.Unit]
         CompanyDatatypes.$fDataDept_$dData
         ww2_s2kA)
    }

CompanyDatatypes.$fDataDept [InlPrag=[ALWAYS] CONLIKE]
  :: Data.Data.Data CompanyDatatypes.Dept
[GblId[DFunId],
 Str=DmdType,
 Unf=DFun(arity=0) Data.Data.D:Data [{CompanyDatatypes.$fTypeableDept},
                                     {CompanyDatatypes.$fDataDept_$cgfoldl},
                                     {CompanyDatatypes.$fDataDept_$cgunfold},
                                     {CompanyDatatypes.$fDataDept_$ctoConstr},
                                     {CompanyDatatypes.$fDataDept_$cdataTypeOf},
                                     {CompanyDatatypes.$fDataDept_$cdataCast1},
                                     {CompanyDatatypes.$fDataDept_$cdataCast2},
                                     {CompanyDatatypes.$fDataDept_$cgmapT},
                                     {CompanyDatatypes.$fDataDept_$cgmapQl},
                                     {CompanyDatatypes.$fDataDept_$cgmapQr},
                                     {CompanyDatatypes.$fDataDept_$cgmapQ},
                                     {CompanyDatatypes.$fDataDept_$cgmapQi},
                                     {CompanyDatatypes.$fDataDept_$cgmapM},
                                     {CompanyDatatypes.$fDataDept_$cgmapMp},
                                     {CompanyDatatypes.$fDataDept_$cgmapMo}]]
CompanyDatatypes.$fDataDept =
  Data.Data.D:Data
    @ CompanyDatatypes.Dept
    (CompanyDatatypes.$fTypeableDept_$ctypeOf
     `cast` (Sym
               <(Data.Typeable.Internal.NTCo:Typeable <CompanyDatatypes.Dept>)>
             :: (CompanyDatatypes.Dept -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable CompanyDatatypes.Dept))
    CompanyDatatypes.$fDataDept_$cgfoldl
    CompanyDatatypes.$fDataDept_$cgunfold
    CompanyDatatypes.$fDataDept_$ctoConstr
    CompanyDatatypes.$fDataDept_$cdataTypeOf
    CompanyDatatypes.$fDataDept_$cdataCast1
    CompanyDatatypes.$fDataDept_$cdataCast2
    CompanyDatatypes.$fDataDept_$cgmapT
    CompanyDatatypes.$fDataDept_$cgmapQl
    CompanyDatatypes.$fDataDept_$cgmapQr
    CompanyDatatypes.$fDataDept_$cgmapQ
    CompanyDatatypes.$fDataDept_$cgmapQi
    CompanyDatatypes.$fDataDept_$cgmapM
    CompanyDatatypes.$fDataDept_$cgmapMp
    CompanyDatatypes.$fDataDept_$cgmapMo

$dData1_r3dX :: Data.Data.Data [CompanyDatatypes.Unit]
[GblId, Str=DmdType]
$dData1_r3dX =
  Data.Data.$fData[]
    @ CompanyDatatypes.Unit
    (CompanyDatatypes.$fDataDept1
     `cast` (Sym
               <(Data.Typeable.Internal.NTCo:Typeable <[CompanyDatatypes.Unit]>)>
             :: ([CompanyDatatypes.Unit] -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable [CompanyDatatypes.Unit]))
    CompanyDatatypes.$fDataUnit

CompanyDatatypes.$w$cgmapMo2 [Occ=LoopBreaker]
  :: forall (m_aY8 :: * -> *).
     GHC.Base.Monad m_aY8 =>
     (forall a_a1nd. m_aY8 a_a1nd)
     -> (forall a_a1nc. m_aY8 a_a1nc -> m_aY8 a_a1nc -> m_aY8 a_a1nc)
     -> (forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
     -> CompanyDatatypes.Unit
     -> m_aY8 CompanyDatatypes.Unit
[GblId, Arity=5, Str=DmdType SLLLL]
CompanyDatatypes.$w$cgmapMo2 =
  \ (@ (m_aY8 :: * -> *))
    (ww_s2iq :: GHC.Base.Monad m_aY8)
    (ww1_s2ir :: forall a_a1nd. m_aY8 a_a1nd)
    (ww2_s2is
       :: forall a_a1nc. m_aY8 a_a1nc -> m_aY8 a_a1nc -> m_aY8 a_a1nc)
    (w_s2iu
       :: forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
    (w3_s2iv :: CompanyDatatypes.Unit) ->
    case ww_s2iq
    of _ { GHC.Base.D:Monad ww3_s2ig ww4_s2ih ww5_s2ii ww6_s2ij ->
    ww3_s2ig
      @ (CompanyDatatypes.Unit, GHC.Types.Bool)
      @ CompanyDatatypes.Unit
      (let {
         a22_s2tD
           :: forall d_a1mF b_a1mG.
              Data.Data.Data d_a1mF =>
              Data.Data.Mp m_aY8 (d_a1mF -> b_a1mG)
              -> d_a1mF -> m_aY8 (b_a1mG, GHC.Types.Bool)
         [LclId, Arity=3]
         a22_s2tD =
           \ (@ d_a1mF)
             (@ b_a1mG)
             ($dData2_a1mH :: Data.Data.Data d_a1mF)
             (ds_a1mI :: Data.Data.Mp m_aY8 (d_a1mF -> b_a1mG))
             (y_a1mJ :: d_a1mF) ->
             let {
               lvl11_s1Fw :: m_aY8 d_a1mF
               [LclId, Str=DmdType]
               lvl11_s1Fw = w_s2iu @ d_a1mF $dData2_a1mH y_a1mJ } in
             ww3_s2ig
               @ (d_a1mF -> b_a1mG, GHC.Types.Bool)
               @ (b_a1mG, GHC.Types.Bool)
               (ds_a1mI
                `cast` (<Data.Data.NTCo:Mp <m_aY8> <d_a1mF -> b_a1mG>>
                        :: Data.Data.Mp m_aY8 (d_a1mF -> b_a1mG)
                             ~#
                           m_aY8 (d_a1mF -> b_a1mG, GHC.Types.Bool)))
               (\ (ds1_a1mK :: (d_a1mF -> b_a1mG, GHC.Types.Bool)) ->
                  case ds1_a1mK of _ { (h_a1mN, b_a1mO) ->
                  case b_a1mO of _ {
                    GHC.Types.False ->
                      ww2_s2is
                        @ (b_a1mG, GHC.Types.Bool)
                        (ww3_s2ig
                           @ d_a1mF
                           @ (b_a1mG, GHC.Types.Bool)
                           lvl11_s1Fw
                           (\ (y'_a1mT :: d_a1mF) ->
                              ww5_s2ii
                                @ (b_a1mG, GHC.Types.Bool) (h_a1mN y'_a1mT, GHC.Types.True)))
                        (ww5_s2ii
                           @ (b_a1mG, GHC.Types.Bool) (h_a1mN y_a1mJ, GHC.Types.False));
                    GHC.Types.True ->
                      ww5_s2ii @ (b_a1mG, GHC.Types.Bool) (h_a1mN y_a1mJ, GHC.Types.True)
                  }
                  }) } in
       case w3_s2iv of _ {
         CompanyDatatypes.PU a23_aSQ ->
           a22_s2tD
             @ CompanyDatatypes.Employee
             @ CompanyDatatypes.Unit
             CompanyDatatypes.$fDataEmployee
             ((ww5_s2ii
                 @ (CompanyDatatypes.Employee -> CompanyDatatypes.Unit,
                    GHC.Types.Bool)
                 lvl8_r3dU)
              `cast` (Sym
                        <(Data.Data.NTCo:Mp
                            <m_aY8> <CompanyDatatypes.Employee -> CompanyDatatypes.Unit>)>
                      :: m_aY8 (CompanyDatatypes.Employee -> CompanyDatatypes.Unit,
                                GHC.Types.Bool)
                           ~#
                         Data.Data.Mp
                           m_aY8 (CompanyDatatypes.Employee -> CompanyDatatypes.Unit)))
             a23_aSQ;
         CompanyDatatypes.DU a23_aST ->
           a22_s2tD
             @ CompanyDatatypes.Dept
             @ CompanyDatatypes.Unit
             CompanyDatatypes.$fDataDept
             ((ww5_s2ii
                 @ (CompanyDatatypes.Dept -> CompanyDatatypes.Unit, GHC.Types.Bool)
                 lvl9_r3dV)
              `cast` (Sym
                        <(Data.Data.NTCo:Mp
                            <m_aY8> <CompanyDatatypes.Dept -> CompanyDatatypes.Unit>)>
                      :: m_aY8 (CompanyDatatypes.Dept -> CompanyDatatypes.Unit,
                                GHC.Types.Bool)
                           ~#
                         Data.Data.Mp
                           m_aY8 (CompanyDatatypes.Dept -> CompanyDatatypes.Unit)))
             a23_aST
       })
      (\ (ds_a1n1 :: (CompanyDatatypes.Unit, GHC.Types.Bool)) ->
         case ds_a1n1 of _ { (x'_a1n4, b_a1n5) ->
         case b_a1n5 of _ {
           GHC.Types.False -> ww1_s2ir @ CompanyDatatypes.Unit;
           GHC.Types.True -> ww5_s2ii @ CompanyDatatypes.Unit x'_a1n4
         }
         })
    }

CompanyDatatypes.$w$cgmapMp1 [Occ=LoopBreaker]
  :: forall (m_aXe :: * -> *).
     GHC.Base.Monad m_aXe =>
     (forall a_a1nd. m_aXe a_a1nd)
     -> (forall a_a1nc. m_aXe a_a1nc -> m_aXe a_a1nc -> m_aXe a_a1nc)
     -> (forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
     -> CompanyDatatypes.Unit
     -> m_aXe CompanyDatatypes.Unit
[GblId, Arity=5, Str=DmdType SLLLL]
CompanyDatatypes.$w$cgmapMp1 =
  \ (@ (m_aXe :: * -> *))
    (ww_s2iI :: GHC.Base.Monad m_aXe)
    (ww1_s2iJ :: forall a_a1nd. m_aXe a_a1nd)
    (ww2_s2iK
       :: forall a_a1nc. m_aXe a_a1nc -> m_aXe a_a1nc -> m_aXe a_a1nc)
    (w_s2iM
       :: forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
    (w3_s2iN :: CompanyDatatypes.Unit) ->
    case ww_s2iI
    of _ { GHC.Base.D:Monad ww3_s2iy ww4_s2iz ww5_s2iA ww6_s2iB ->
    ww3_s2iy
      @ (CompanyDatatypes.Unit, GHC.Types.Bool)
      @ CompanyDatatypes.Unit
      (let {
         a22_s2tQ
           :: forall d_a1nA b_a1nB.
              Data.Data.Data d_a1nA =>
              Data.Data.Mp m_aXe (d_a1nA -> b_a1nB)
              -> d_a1nA -> m_aXe (b_a1nB, GHC.Types.Bool)
         [LclId, Arity=3]
         a22_s2tQ =
           \ (@ d_a1nA)
             (@ b_a1nB)
             ($dData2_a1nC :: Data.Data.Data d_a1nA)
             (ds_a1nD :: Data.Data.Mp m_aXe (d_a1nA -> b_a1nB))
             (y_a1nE :: d_a1nA) ->
             let {
               lvl11_s1Fy [Dmd=Just L] :: m_aXe d_a1nA
               [LclId, Str=DmdType]
               lvl11_s1Fy = w_s2iM @ d_a1nA $dData2_a1nC y_a1nE } in
             ww3_s2iy
               @ (d_a1nA -> b_a1nB, GHC.Types.Bool)
               @ (b_a1nB, GHC.Types.Bool)
               (ds_a1nD
                `cast` (<Data.Data.NTCo:Mp <m_aXe> <d_a1nA -> b_a1nB>>
                        :: Data.Data.Mp m_aXe (d_a1nA -> b_a1nB)
                             ~#
                           m_aXe (d_a1nA -> b_a1nB, GHC.Types.Bool)))
               (\ (ds1_a1nF :: (d_a1nA -> b_a1nB, GHC.Types.Bool)) ->
                  case ds1_a1nF of _ { (h_a1nI, b_a1nJ) ->
                  ww2_s2iK
                    @ (b_a1nB, GHC.Types.Bool)
                    (ww3_s2iy
                       @ d_a1nA
                       @ (b_a1nB, GHC.Types.Bool)
                       lvl11_s1Fy
                       (\ (y'_a1nL :: d_a1nA) ->
                          ww5_s2iA
                            @ (b_a1nB, GHC.Types.Bool) (h_a1nI y'_a1nL, GHC.Types.True)))
                    (ww5_s2iA @ (b_a1nB, GHC.Types.Bool) (h_a1nI y_a1nE, b_a1nJ))
                  }) } in
       case w3_s2iN of _ {
         CompanyDatatypes.PU a23_aSQ ->
           a22_s2tQ
             @ CompanyDatatypes.Employee
             @ CompanyDatatypes.Unit
             CompanyDatatypes.$fDataEmployee
             ((ww5_s2iA
                 @ (CompanyDatatypes.Employee -> CompanyDatatypes.Unit,
                    GHC.Types.Bool)
                 lvl8_r3dU)
              `cast` (Sym
                        <(Data.Data.NTCo:Mp
                            <m_aXe> <CompanyDatatypes.Employee -> CompanyDatatypes.Unit>)>
                      :: m_aXe (CompanyDatatypes.Employee -> CompanyDatatypes.Unit,
                                GHC.Types.Bool)
                           ~#
                         Data.Data.Mp
                           m_aXe (CompanyDatatypes.Employee -> CompanyDatatypes.Unit)))
             a23_aSQ;
         CompanyDatatypes.DU a23_aST ->
           a22_s2tQ
             @ CompanyDatatypes.Dept
             @ CompanyDatatypes.Unit
             CompanyDatatypes.$fDataDept
             ((ww5_s2iA
                 @ (CompanyDatatypes.Dept -> CompanyDatatypes.Unit, GHC.Types.Bool)
                 lvl9_r3dV)
              `cast` (Sym
                        <(Data.Data.NTCo:Mp
                            <m_aXe> <CompanyDatatypes.Dept -> CompanyDatatypes.Unit>)>
                      :: m_aXe (CompanyDatatypes.Dept -> CompanyDatatypes.Unit,
                                GHC.Types.Bool)
                           ~#
                         Data.Data.Mp
                           m_aXe (CompanyDatatypes.Dept -> CompanyDatatypes.Unit)))
             a23_aST
       })
      (\ (ds_a1nR :: (CompanyDatatypes.Unit, GHC.Types.Bool)) ->
         case ds_a1nR of _ { (x'_a1nU, b_a1nV) ->
         case b_a1nV of _ {
           GHC.Types.False -> ww1_s2iJ @ CompanyDatatypes.Unit;
           GHC.Types.True -> ww5_s2iA @ CompanyDatatypes.Unit x'_a1nU
         }
         })
    }

CompanyDatatypes.$w$cgmapM1 [Occ=LoopBreaker]
  :: forall (m_aX4 :: * -> *).
     (forall a_a1ne b_a1nf.
      m_aX4 a_a1ne -> (a_a1ne -> m_aX4 b_a1nf) -> m_aX4 b_a1nf)
     -> (forall a_a1ni. a_a1ni -> m_aX4 a_a1ni)
     -> (forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
     -> CompanyDatatypes.Unit
     -> m_aX4 CompanyDatatypes.Unit
[GblId, Arity=4, Str=DmdType SLLS]
CompanyDatatypes.$w$cgmapM1 =
  \ (@ (m_aX4 :: * -> *))
    (ww_s2iU
       :: forall a_a1ne b_a1nf.
          m_aX4 a_a1ne -> (a_a1ne -> m_aX4 b_a1nf) -> m_aX4 b_a1nf)
    (ww1_s2iW :: forall a_a1ni. a_a1ni -> m_aX4 a_a1ni)
    (w_s2iZ
       :: forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
    (w3_s2j0 :: CompanyDatatypes.Unit) ->
    let {
      k_aSO
        :: forall d_aV1 b_aV2.
           Data.Data.Data d_aV1 =>
           m_aX4 (d_aV1 -> b_aV2) -> d_aV1 -> m_aX4 b_aV2
      [LclId, Arity=3]
      k_aSO =
        \ (@ d_a1ob)
          (@ b_a1oc)
          ($dData2_a1od :: Data.Data.Data d_a1ob)
          (c_a1oe :: m_aX4 (d_a1ob -> b_a1oc))
          (x_a1of :: d_a1ob) ->
          let {
            lvl11_s1Fz [Dmd=Just L] :: m_aX4 d_a1ob
            [LclId, Str=DmdType]
            lvl11_s1Fz = w_s2iZ @ d_a1ob $dData2_a1od x_a1of } in
          ww_s2iU
            @ (d_a1ob -> b_a1oc)
            @ b_a1oc
            c_a1oe
            (\ (c'_a1og :: d_a1ob -> b_a1oc) ->
               ww_s2iU
                 @ d_a1ob
                 @ b_a1oc
                 lvl11_s1Fz
                 (\ (x'_a1oh :: d_a1ob) ->
                    ww1_s2iW @ b_a1oc (c'_a1og x'_a1oh))) } in
    case w3_s2j0 of _ {
      CompanyDatatypes.PU a22_aSQ ->
        k_aSO
          @ CompanyDatatypes.Employee
          @ CompanyDatatypes.Unit
          CompanyDatatypes.$fDataEmployee
          (ww1_s2iW
             @ (CompanyDatatypes.Employee -> CompanyDatatypes.Unit)
             CompanyDatatypes.PU)
          a22_aSQ;
      CompanyDatatypes.DU a22_aST ->
        k_aSO
          @ CompanyDatatypes.Dept
          @ CompanyDatatypes.Unit
          CompanyDatatypes.$fDataDept
          (ww1_s2iW
             @ (CompanyDatatypes.Dept -> CompanyDatatypes.Unit)
             CompanyDatatypes.DU)
          a22_aST
    }

CompanyDatatypes.$fDataUnit_$cgmapQi [Occ=LoopBreaker]
  :: forall u_aWW.
     GHC.Types.Int
     -> (forall d_aWX. Data.Data.Data d_aWX => d_aWX -> u_aWW)
     -> CompanyDatatypes.Unit
     -> u_aWW
[GblId, Arity=3, Str=DmdType LLS]
CompanyDatatypes.$fDataUnit_$cgmapQi =
  \ (@ u_a1ol)
    (i_a1om :: GHC.Types.Int)
    (f_a1on
       :: forall d_a1oo. Data.Data.Data d_a1oo => d_a1oo -> u_a1ol)
    (x_a1op :: CompanyDatatypes.Unit) ->
    case x_a1op of _ {
      CompanyDatatypes.PU a22_aSQ ->
        case i_a1om of _ { GHC.Types.I# x1_a1p2 ->
        case x1_a1p2 of _ {
          __DEFAULT -> Data.Maybe.fromJust1 @ u_a1ol;
          0 ->
            f_a1on
              @ CompanyDatatypes.Employee CompanyDatatypes.$fDataEmployee a22_aSQ
        }
        };
      CompanyDatatypes.DU a22_aST ->
        case i_a1om of _ { GHC.Types.I# x1_a1p2 ->
        case x1_a1p2 of _ {
          __DEFAULT -> Data.Maybe.fromJust1 @ u_a1ol;
          0 ->
            f_a1on @ CompanyDatatypes.Dept CompanyDatatypes.$fDataDept a22_aST
        }
        }
    }

CompanyDatatypes.$fDataUnit_$cgmapQ [Occ=LoopBreaker]
  :: forall u_aWO.
     (forall d_aWP. Data.Data.Data d_aWP => d_aWP -> u_aWO)
     -> CompanyDatatypes.Unit -> [u_aWO]
[GblId, Arity=2, Str=DmdType LS]
CompanyDatatypes.$fDataUnit_$cgmapQ =
  \ (@ u_a1pL)
    (f_a1pM
       :: forall d_a1pN. Data.Data.Data d_a1pN => d_a1pN -> u_a1pL)
    (eta_B1 :: CompanyDatatypes.Unit) ->
    case eta_B1 of _ {
      CompanyDatatypes.PU a22_aSQ ->
        GHC.Types.:
          @ u_a1pL
          (f_a1pM
             @ CompanyDatatypes.Employee
             CompanyDatatypes.$fDataEmployee
             a22_aSQ)
          (GHC.Types.[] @ u_a1pL);
      CompanyDatatypes.DU a22_aST ->
        GHC.Types.:
          @ u_a1pL
          (f_a1pM
             @ CompanyDatatypes.Dept CompanyDatatypes.$fDataDept a22_aST)
          (GHC.Types.[] @ u_a1pL)
    }

CompanyDatatypes.$fDataUnit_$cgmapQr [Occ=LoopBreaker]
  :: forall r_aWE r'_aWF.
     (r'_aWF -> r_aWE -> r_aWE)
     -> r_aWE
     -> (forall d_aWG. Data.Data.Data d_aWG => d_aWG -> r'_aWF)
     -> CompanyDatatypes.Unit
     -> r_aWE
[GblId, Arity=4, Str=DmdType LLLS]
CompanyDatatypes.$fDataUnit_$cgmapQr =
  \ (@ r_a1pQ)
    (@ r'_a1pR)
    (o_a1pS :: r'_a1pR -> r_a1pQ -> r_a1pQ)
    (r0_a1pT :: r_a1pQ)
    (f_a1pU
       :: forall d_a1pV. Data.Data.Data d_a1pV => d_a1pV -> r'_a1pR)
    (x0_a1pW :: CompanyDatatypes.Unit) ->
    case x0_a1pW of _ {
      CompanyDatatypes.PU a22_aSQ ->
        o_a1pS
          (f_a1pU
             @ CompanyDatatypes.Employee
             CompanyDatatypes.$fDataEmployee
             a22_aSQ)
          r0_a1pT;
      CompanyDatatypes.DU a22_aST ->
        o_a1pS
          (f_a1pU
             @ CompanyDatatypes.Dept CompanyDatatypes.$fDataDept a22_aST)
          r0_a1pT
    }

CompanyDatatypes.$fDataUnit1 [Occ=LoopBreaker]
  :: forall r_a1qt r'_a1qu.
     (r_a1qt -> r'_a1qu -> r_a1qt)
     -> r_a1qt
     -> (forall d_a1qy. Data.Data.Data d_a1qy => d_a1qy -> r'_a1qu)
     -> CompanyDatatypes.Unit
     -> Data.Data.CONST r_a1qt CompanyDatatypes.Unit
[GblId, Arity=4, Str=DmdType C(C(S))LLS]
CompanyDatatypes.$fDataUnit1 =
  \ (@ r_a1qt)
    (@ r'_a1qu)
    (o_a1qv :: r_a1qt -> r'_a1qu -> r_a1qt)
    (r_a1qw :: r_a1qt)
    (f_a1qx
       :: forall d_a1qy. Data.Data.Data d_a1qy => d_a1qy -> r'_a1qu)
    (eta_B1 :: CompanyDatatypes.Unit) ->
    case eta_B1 of _ {
      CompanyDatatypes.PU a22_aSQ ->
        (o_a1qv
           r_a1qw
           (f_a1qx
              @ CompanyDatatypes.Employee
              CompanyDatatypes.$fDataEmployee
              a22_aSQ))
        `cast` (Sym
                  <(Data.Data.NTCo:CONST <r_a1qt> <CompanyDatatypes.Unit>)>
                :: r_a1qt ~# Data.Data.CONST r_a1qt CompanyDatatypes.Unit);
      CompanyDatatypes.DU a22_aST ->
        (o_a1qv
           r_a1qw
           (f_a1qx
              @ CompanyDatatypes.Dept CompanyDatatypes.$fDataDept a22_aST))
        `cast` (Sym
                  <(Data.Data.NTCo:CONST <r_a1qt> <CompanyDatatypes.Unit>)>
                :: r_a1qt ~# Data.Data.CONST r_a1qt CompanyDatatypes.Unit)
    }

CompanyDatatypes.$w$cgmapMo1 [Occ=LoopBreaker]
  :: forall (m_aY8 :: * -> *).
     GHC.Base.Monad m_aY8 =>
     (forall a_a1nd. m_aY8 a_a1nd)
     -> (forall a_a1nc. m_aY8 a_a1nc -> m_aY8 a_a1nc -> m_aY8 a_a1nc)
     -> (forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
     -> CompanyDatatypes.Dept
     -> m_aY8 CompanyDatatypes.Dept
[GblId, Arity=5, Str=DmdType SLLLL]
CompanyDatatypes.$w$cgmapMo1 =
  \ (@ (m_aY8 :: * -> *))
    (ww_s2lm :: GHC.Base.Monad m_aY8)
    (ww1_s2ln :: forall a_a1nd. m_aY8 a_a1nd)
    (ww2_s2lo
       :: forall a_a1nc. m_aY8 a_a1nc -> m_aY8 a_a1nc -> m_aY8 a_a1nc)
    (w_s2lq
       :: forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
    (w3_s2lr :: CompanyDatatypes.Dept) ->
    case ww_s2lm
    of _ { GHC.Base.D:Monad ww3_s2lc ww4_s2ld ww5_s2le ww6_s2lf ->
    ww3_s2lc
      @ (CompanyDatatypes.Dept, GHC.Types.Bool)
      @ CompanyDatatypes.Dept
      (case w3_s2lr of _ { CompanyDatatypes.D a22_aTb a23_aTc a24_aTd ->
       let {
         a25_s1Mv
           :: forall d_X1yR b_X1yT.
              Data.Data.Data d_X1yR =>
              Data.Data.Mp m_aY8 (d_X1yR -> b_X1yT)
              -> d_X1yR -> m_aY8 (b_X1yT, GHC.Types.Bool)
         [LclId, Arity=3, Str=DmdType LLL]
         a25_s1Mv =
           \ (@ d_a1mF)
             (@ b_a1mG)
             ($dData2_a1mH :: Data.Data.Data d_a1mF)
             (ds_a1mI :: Data.Data.Mp m_aY8 (d_a1mF -> b_a1mG))
             (y_a1mJ :: d_a1mF) ->
             let {
               lvl11_s1FQ :: m_aY8 d_a1mF
               [LclId, Str=DmdType]
               lvl11_s1FQ = w_s2lq @ d_a1mF $dData2_a1mH y_a1mJ } in
             ww3_s2lc
               @ (d_a1mF -> b_a1mG, GHC.Types.Bool)
               @ (b_a1mG, GHC.Types.Bool)
               (ds_a1mI
                `cast` (<Data.Data.NTCo:Mp <m_aY8> <d_a1mF -> b_a1mG>>
                        :: Data.Data.Mp m_aY8 (d_a1mF -> b_a1mG)
                             ~#
                           m_aY8 (d_a1mF -> b_a1mG, GHC.Types.Bool)))
               (\ (ds1_a1mK :: (d_a1mF -> b_a1mG, GHC.Types.Bool)) ->
                  case ds1_a1mK of _ { (h_a1mN, b_a1mO) ->
                  case b_a1mO of _ {
                    GHC.Types.False ->
                      ww2_s2lo
                        @ (b_a1mG, GHC.Types.Bool)
                        (ww3_s2lc
                           @ d_a1mF
                           @ (b_a1mG, GHC.Types.Bool)
                           lvl11_s1FQ
                           (\ (y'_a1mT :: d_a1mF) ->
                              ww5_s2le
                                @ (b_a1mG, GHC.Types.Bool) (h_a1mN y'_a1mT, GHC.Types.True)))
                        (ww5_s2le
                           @ (b_a1mG, GHC.Types.Bool) (h_a1mN y_a1mJ, GHC.Types.False));
                    GHC.Types.True ->
                      ww5_s2le @ (b_a1mG, GHC.Types.Bool) (h_a1mN y_a1mJ, GHC.Types.True)
                  }
                  }) } in
       a25_s1Mv
         @ [CompanyDatatypes.Unit]
         @ CompanyDatatypes.Dept
         CompanyDatatypes.$fDataDept_$dData
         ((a25_s1Mv
             @ CompanyDatatypes.Manager
             @ ([CompanyDatatypes.Unit] -> CompanyDatatypes.Dept)
             CompanyDatatypes.$fDataEmployee
             ((a25_s1Mv
                 @ CompanyDatatypes.Name
                 @ (CompanyDatatypes.Manager
                    -> [CompanyDatatypes.Unit] -> CompanyDatatypes.Dept)
                 CompanyDatatypes.$fDataDept_$dData1
                 ((ww5_s2le
                     @ (CompanyDatatypes.Name
                        -> CompanyDatatypes.Manager
                        -> [CompanyDatatypes.Unit]
                        -> CompanyDatatypes.Dept,
                        GHC.Types.Bool)
                     lvl10_r3dW)
                  `cast` (Sym
                            <(Data.Data.NTCo:Mp
                                <m_aY8>
                                <CompanyDatatypes.Name
                                 -> CompanyDatatypes.Manager
                                 -> [CompanyDatatypes.Unit]
                                 -> CompanyDatatypes.Dept>)>
                          :: m_aY8 (CompanyDatatypes.Name
                                    -> CompanyDatatypes.Manager
                                    -> [CompanyDatatypes.Unit]
                                    -> CompanyDatatypes.Dept,
                                    GHC.Types.Bool)
                               ~#
                             Data.Data.Mp
                               m_aY8
                               (CompanyDatatypes.Name
                                -> CompanyDatatypes.Manager
                                -> [CompanyDatatypes.Unit]
                                -> CompanyDatatypes.Dept)))
                 a22_aTb)
              `cast` (Sym
                        <(Data.Data.NTCo:Mp
                            <m_aY8>
                            <CompanyDatatypes.Manager
                             -> [CompanyDatatypes.Unit] -> CompanyDatatypes.Dept>)>
                      :: m_aY8 (CompanyDatatypes.Manager
                                -> [CompanyDatatypes.Unit] -> CompanyDatatypes.Dept,
                                GHC.Types.Bool)
                           ~#
                         Data.Data.Mp
                           m_aY8
                           (CompanyDatatypes.Manager
                            -> [CompanyDatatypes.Unit] -> CompanyDatatypes.Dept)))
             a23_aTc)
          `cast` (Sym
                    <(Data.Data.NTCo:Mp
                        <m_aY8> <[CompanyDatatypes.Unit] -> CompanyDatatypes.Dept>)>
                  :: m_aY8 ([CompanyDatatypes.Unit] -> CompanyDatatypes.Dept,
                            GHC.Types.Bool)
                       ~#
                     Data.Data.Mp
                       m_aY8 ([CompanyDatatypes.Unit] -> CompanyDatatypes.Dept)))
         a24_aTd
       })
      (\ (ds_a1n1 :: (CompanyDatatypes.Dept, GHC.Types.Bool)) ->
         case ds_a1n1 of _ { (x'_a1n4, b_a1n5) ->
         case b_a1n5 of _ {
           GHC.Types.False -> ww1_s2ln @ CompanyDatatypes.Dept;
           GHC.Types.True -> ww5_s2le @ CompanyDatatypes.Dept x'_a1n4
         }
         })
    }

CompanyDatatypes.$w$cgmapMp [Occ=LoopBreaker]
  :: forall (m_aXe :: * -> *).
     GHC.Base.Monad m_aXe =>
     (forall a_a1nd. m_aXe a_a1nd)
     -> (forall a_a1nc. m_aXe a_a1nc -> m_aXe a_a1nc -> m_aXe a_a1nc)
     -> (forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
     -> CompanyDatatypes.Dept
     -> m_aXe CompanyDatatypes.Dept
[GblId, Arity=5, Str=DmdType SLLLL]
CompanyDatatypes.$w$cgmapMp =
  \ (@ (m_aXe :: * -> *))
    (ww_s2jd :: GHC.Base.Monad m_aXe)
    (ww1_s2je :: forall a_a1nd. m_aXe a_a1nd)
    (ww2_s2jf
       :: forall a_a1nc. m_aXe a_a1nc -> m_aXe a_a1nc -> m_aXe a_a1nc)
    (w_s2jh
       :: forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
    (w3_s2ji :: CompanyDatatypes.Dept) ->
    case ww_s2jd
    of _ { GHC.Base.D:Monad ww3_s2j3 ww4_s2j4 ww5_s2j5 ww6_s2j6 ->
    ww3_s2j3
      @ (CompanyDatatypes.Dept, GHC.Types.Bool)
      @ CompanyDatatypes.Dept
      (case w3_s2ji of _ { CompanyDatatypes.D a22_aTb a23_aTc a24_aTd ->
       let {
         a25_s1Mo
           :: forall d_X1zN b_X1zP.
              Data.Data.Data d_X1zN =>
              Data.Data.Mp m_aXe (d_X1zN -> b_X1zP)
              -> d_X1zN -> m_aXe (b_X1zP, GHC.Types.Bool)
         [LclId, Arity=3, Str=DmdType LLL]
         a25_s1Mo =
           \ (@ d_a1nA)
             (@ b_a1nB)
             ($dData2_a1nC :: Data.Data.Data d_a1nA)
             (ds_a1nD :: Data.Data.Mp m_aXe (d_a1nA -> b_a1nB))
             (y_a1nE :: d_a1nA) ->
             let {
               lvl11_s1FO [Dmd=Just L] :: m_aXe d_a1nA
               [LclId, Str=DmdType]
               lvl11_s1FO = w_s2jh @ d_a1nA $dData2_a1nC y_a1nE } in
             ww3_s2j3
               @ (d_a1nA -> b_a1nB, GHC.Types.Bool)
               @ (b_a1nB, GHC.Types.Bool)
               (ds_a1nD
                `cast` (<Data.Data.NTCo:Mp <m_aXe> <d_a1nA -> b_a1nB>>
                        :: Data.Data.Mp m_aXe (d_a1nA -> b_a1nB)
                             ~#
                           m_aXe (d_a1nA -> b_a1nB, GHC.Types.Bool)))
               (\ (ds1_a1nF :: (d_a1nA -> b_a1nB, GHC.Types.Bool)) ->
                  case ds1_a1nF of _ { (h_a1nI, b_a1nJ) ->
                  ww2_s2jf
                    @ (b_a1nB, GHC.Types.Bool)
                    (ww3_s2j3
                       @ d_a1nA
                       @ (b_a1nB, GHC.Types.Bool)
                       lvl11_s1FO
                       (\ (y'_a1nL :: d_a1nA) ->
                          ww5_s2j5
                            @ (b_a1nB, GHC.Types.Bool) (h_a1nI y'_a1nL, GHC.Types.True)))
                    (ww5_s2j5 @ (b_a1nB, GHC.Types.Bool) (h_a1nI y_a1nE, b_a1nJ))
                  }) } in
       a25_s1Mo
         @ [CompanyDatatypes.Unit]
         @ CompanyDatatypes.Dept
         CompanyDatatypes.$fDataDept_$dData
         ((a25_s1Mo
             @ CompanyDatatypes.Manager
             @ ([CompanyDatatypes.Unit] -> CompanyDatatypes.Dept)
             CompanyDatatypes.$fDataEmployee
             ((a25_s1Mo
                 @ CompanyDatatypes.Name
                 @ (CompanyDatatypes.Manager
                    -> [CompanyDatatypes.Unit] -> CompanyDatatypes.Dept)
                 CompanyDatatypes.$fDataDept_$dData1
                 ((ww5_s2j5
                     @ (CompanyDatatypes.Name
                        -> CompanyDatatypes.Manager
                        -> [CompanyDatatypes.Unit]
                        -> CompanyDatatypes.Dept,
                        GHC.Types.Bool)
                     lvl10_r3dW)
                  `cast` (Sym
                            <(Data.Data.NTCo:Mp
                                <m_aXe>
                                <CompanyDatatypes.Name
                                 -> CompanyDatatypes.Manager
                                 -> [CompanyDatatypes.Unit]
                                 -> CompanyDatatypes.Dept>)>
                          :: m_aXe (CompanyDatatypes.Name
                                    -> CompanyDatatypes.Manager
                                    -> [CompanyDatatypes.Unit]
                                    -> CompanyDatatypes.Dept,
                                    GHC.Types.Bool)
                               ~#
                             Data.Data.Mp
                               m_aXe
                               (CompanyDatatypes.Name
                                -> CompanyDatatypes.Manager
                                -> [CompanyDatatypes.Unit]
                                -> CompanyDatatypes.Dept)))
                 a22_aTb)
              `cast` (Sym
                        <(Data.Data.NTCo:Mp
                            <m_aXe>
                            <CompanyDatatypes.Manager
                             -> [CompanyDatatypes.Unit] -> CompanyDatatypes.Dept>)>
                      :: m_aXe (CompanyDatatypes.Manager
                                -> [CompanyDatatypes.Unit] -> CompanyDatatypes.Dept,
                                GHC.Types.Bool)
                           ~#
                         Data.Data.Mp
                           m_aXe
                           (CompanyDatatypes.Manager
                            -> [CompanyDatatypes.Unit] -> CompanyDatatypes.Dept)))
             a23_aTc)
          `cast` (Sym
                    <(Data.Data.NTCo:Mp
                        <m_aXe> <[CompanyDatatypes.Unit] -> CompanyDatatypes.Dept>)>
                  :: m_aXe ([CompanyDatatypes.Unit] -> CompanyDatatypes.Dept,
                            GHC.Types.Bool)
                       ~#
                     Data.Data.Mp
                       m_aXe ([CompanyDatatypes.Unit] -> CompanyDatatypes.Dept)))
         a24_aTd
       })
      (\ (ds_a1nR :: (CompanyDatatypes.Dept, GHC.Types.Bool)) ->
         case ds_a1nR of _ { (x'_a1nU, b_a1nV) ->
         case b_a1nV of _ {
           GHC.Types.False -> ww1_s2je @ CompanyDatatypes.Dept;
           GHC.Types.True -> ww5_s2j5 @ CompanyDatatypes.Dept x'_a1nU
         }
         })
    }

CompanyDatatypes.$w$cgmapM [Occ=LoopBreaker]
  :: forall (m_aX4 :: * -> *).
     (forall a_a1ne b_a1nf.
      m_aX4 a_a1ne -> (a_a1ne -> m_aX4 b_a1nf) -> m_aX4 b_a1nf)
     -> (forall a_a1ni. a_a1ni -> m_aX4 a_a1ni)
     -> (forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
     -> CompanyDatatypes.Name
     -> CompanyDatatypes.Manager
     -> [CompanyDatatypes.Unit]
     -> m_aX4 CompanyDatatypes.Dept
[GblId, Arity=6, Str=DmdType SLLLLL]
CompanyDatatypes.$w$cgmapM =
  \ (@ (m_aX4 :: * -> *))
    (ww_s2jp
       :: forall a_a1ne b_a1nf.
          m_aX4 a_a1ne -> (a_a1ne -> m_aX4 b_a1nf) -> m_aX4 b_a1nf)
    (ww1_s2jr :: forall a_a1ni. a_a1ni -> m_aX4 a_a1ni)
    (w_s2ju
       :: forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
    (ww2_s2jx :: CompanyDatatypes.Name)
    (ww3_s2jy :: CompanyDatatypes.Manager)
    (ww4_s2jz :: [CompanyDatatypes.Unit]) ->
    let {
      k_XZu
        :: forall d_aV1 b_aV2.
           Data.Data.Data d_aV1 =>
           m_aX4 (d_aV1 -> b_aV2) -> d_aV1 -> m_aX4 b_aV2
      [LclId, Arity=3, Str=DmdType LLL]
      k_XZu =
        \ (@ d_a1ob)
          (@ b_a1oc)
          ($dData2_a1od :: Data.Data.Data d_a1ob)
          (c_a1oe :: m_aX4 (d_a1ob -> b_a1oc))
          (x_a1of :: d_a1ob) ->
          let {
            lvl11_s1FM [Dmd=Just L] :: m_aX4 d_a1ob
            [LclId, Str=DmdType]
            lvl11_s1FM = w_s2ju @ d_a1ob $dData2_a1od x_a1of } in
          ww_s2jp
            @ (d_a1ob -> b_a1oc)
            @ b_a1oc
            c_a1oe
            (\ (c'_a1og :: d_a1ob -> b_a1oc) ->
               ww_s2jp
                 @ d_a1ob
                 @ b_a1oc
                 lvl11_s1FM
                 (\ (x'_a1oh :: d_a1ob) ->
                    ww1_s2jr @ b_a1oc (c'_a1og x'_a1oh))) } in
    k_XZu
      @ [CompanyDatatypes.Unit]
      @ CompanyDatatypes.Dept
      CompanyDatatypes.$fDataDept_$dData
      (k_XZu
         @ CompanyDatatypes.Manager
         @ ([CompanyDatatypes.Unit] -> CompanyDatatypes.Dept)
         CompanyDatatypes.$fDataEmployee
         (k_XZu
            @ CompanyDatatypes.Name
            @ (CompanyDatatypes.Manager
               -> [CompanyDatatypes.Unit] -> CompanyDatatypes.Dept)
            CompanyDatatypes.$fDataDept_$dData1
            (ww1_s2jr
               @ (CompanyDatatypes.Name
                  -> CompanyDatatypes.Manager
                  -> [CompanyDatatypes.Unit]
                  -> CompanyDatatypes.Dept)
               CompanyDatatypes.D)
            ww2_s2jx)
         ww3_s2jy)
      ww4_s2jz

CompanyDatatypes.$w$cgmapQi [Occ=LoopBreaker]
  :: forall u_aWW.
     GHC.Prim.Int#
     -> (forall d_aWX. Data.Data.Data d_aWX => d_aWX -> u_aWW)
     -> CompanyDatatypes.Name
     -> CompanyDatatypes.Manager
     -> [CompanyDatatypes.Unit]
     -> u_aWW
[GblId, Arity=5, Str=DmdType LC(C(S))LLL]
CompanyDatatypes.$w$cgmapQi =
  \ (@ u_aWW)
    (ww_s2jH :: GHC.Prim.Int#)
    (w_s2jJ :: forall d_aWX. Data.Data.Data d_aWX => d_aWX -> u_aWW)
    (ww1_s2jM :: CompanyDatatypes.Name)
    (ww2_s2jN :: CompanyDatatypes.Manager)
    (ww3_s2jO :: [CompanyDatatypes.Unit]) ->
    case ww_s2jH of _ {
      __DEFAULT -> Data.Maybe.fromJust1 @ u_aWW;
      0 ->
        w_s2jJ
          @ CompanyDatatypes.Name
          CompanyDatatypes.$fDataDept_$dData1
          ww1_s2jM;
      1 ->
        w_s2jJ
          @ CompanyDatatypes.Manager
          CompanyDatatypes.$fDataEmployee
          ww2_s2jN;
      2 ->
        w_s2jJ
          @ [CompanyDatatypes.Unit]
          CompanyDatatypes.$fDataDept_$dData
          ww3_s2jO
    }

CompanyDatatypes.$w$cgmapQ [Occ=LoopBreaker]
  :: forall u_aWO.
     (forall d_aWP. Data.Data.Data d_aWP => d_aWP -> u_aWO)
     -> CompanyDatatypes.Name
     -> CompanyDatatypes.Manager
     -> [CompanyDatatypes.Unit]
     -> [u_aWO]
[GblId, Arity=4, Str=DmdType LLLL]
CompanyDatatypes.$w$cgmapQ =
  \ (@ u_aWO)
    (w_s2jT :: forall d_aWP. Data.Data.Data d_aWP => d_aWP -> u_aWO)
    (ww_s2jW :: CompanyDatatypes.Name)
    (ww1_s2jX :: CompanyDatatypes.Manager)
    (ww2_s2jY :: [CompanyDatatypes.Unit]) ->
    CompanyDatatypes.$w$cgmapQr
      @ [u_aWO]
      @ u_aWO
      (GHC.Types.: @ u_aWO)
      (GHC.Types.[] @ u_aWO)
      w_s2jT
      ww_s2jW
      ww1_s2jX
      ww2_s2jY

CompanyDatatypes.$w$cgmapQr [Occ=LoopBreaker]
  :: forall r_aWE r'_aWF.
     (r'_aWF -> r_aWE -> r_aWE)
     -> r_aWE
     -> (forall d_aWG. Data.Data.Data d_aWG => d_aWG -> r'_aWF)
     -> CompanyDatatypes.Name
     -> CompanyDatatypes.Manager
     -> [CompanyDatatypes.Unit]
     -> r_aWE
[GblId, Arity=6, Str=DmdType C(C(S))LLLLL]
CompanyDatatypes.$w$cgmapQr =
  \ (@ r_aWE)
    (@ r'_aWF)
    (w_s2k5 :: r'_aWF -> r_aWE -> r_aWE)
    (w3_s2k6 :: r_aWE)
    (w4_s2k7 :: forall d_aWG. Data.Data.Data d_aWG => d_aWG -> r'_aWF)
    (ww_s2ka :: CompanyDatatypes.Name)
    (ww1_s2kb :: CompanyDatatypes.Manager)
    (ww2_s2kc :: [CompanyDatatypes.Unit]) ->
    w_s2k5
      (w4_s2k7
         @ CompanyDatatypes.Name
         CompanyDatatypes.$fDataDept_$dData1
         ww_s2ka)
      (w_s2k5
         (w4_s2k7
            @ CompanyDatatypes.Manager
            CompanyDatatypes.$fDataEmployee
            ww1_s2kb)
         (w_s2k5
            (w4_s2k7
               @ [CompanyDatatypes.Unit]
               CompanyDatatypes.$fDataDept_$dData
               ww2_s2kc)
            w3_s2k6))

CompanyDatatypes.$w$cgmapQl [Occ=LoopBreaker]
  :: forall r_aWu r'_aWv.
     (r_aWu -> r'_aWv -> r_aWu)
     -> r_aWu
     -> (forall d_aWw. Data.Data.Data d_aWw => d_aWw -> r'_aWv)
     -> CompanyDatatypes.Name
     -> CompanyDatatypes.Manager
     -> [CompanyDatatypes.Unit]
     -> r_aWu
[GblId, Arity=6, Str=DmdType C(C(S))LLLLL]
CompanyDatatypes.$w$cgmapQl =
  \ (@ r_aWu)
    (@ r'_aWv)
    (w_s2kj :: r_aWu -> r'_aWv -> r_aWu)
    (w3_s2kk :: r_aWu)
    (w4_s2kl :: forall d_aWw. Data.Data.Data d_aWw => d_aWw -> r'_aWv)
    (ww_s2ko :: CompanyDatatypes.Name)
    (ww1_s2kp :: CompanyDatatypes.Manager)
    (ww2_s2kq :: [CompanyDatatypes.Unit]) ->
    w_s2kj
      (w_s2kj
         (w_s2kj
            w3_s2kk
            (w4_s2kl
               @ CompanyDatatypes.Name
               CompanyDatatypes.$fDataDept_$dData1
               ww_s2ko))
         (w4_s2kl
            @ CompanyDatatypes.Manager
            CompanyDatatypes.$fDataEmployee
            ww1_s2kp))
      (w4_s2kl
         @ [CompanyDatatypes.Unit]
         CompanyDatatypes.$fDataDept_$dData
         ww2_s2kq)

CompanyDatatypes.$w$cgunfold1 [Occ=LoopBreaker]
  :: forall (c_aV9 :: * -> *).
     (forall b_aVa r_aVb.
      Data.Data.Data b_aVa =>
      c_aV9 (b_aVa -> r_aVb) -> c_aV9 r_aVb)
     -> (forall r_aVc. r_aVc -> c_aV9 r_aVc)
     -> c_aV9 CompanyDatatypes.Dept
[GblId, Arity=2, Str=DmdType C(C(S))L]
CompanyDatatypes.$w$cgunfold1 =
  \ (@ (c_aV9 :: * -> *))
    (w_s2kH
       :: forall b_aVa r_aVb.
          Data.Data.Data b_aVa =>
          c_aV9 (b_aVa -> r_aVb) -> c_aV9 r_aVb)
    (w3_s2kI :: forall r_aVc. r_aVc -> c_aV9 r_aVc) ->
    w_s2kH
      @ [CompanyDatatypes.Unit]
      @ CompanyDatatypes.Dept
      $dData1_r3dX
      (w_s2kH
         @ CompanyDatatypes.Manager
         @ ([CompanyDatatypes.Unit] -> CompanyDatatypes.Dept)
         CompanyDatatypes.$fDataEmployee
         (w_s2kH
            @ CompanyDatatypes.Name
            @ (CompanyDatatypes.Manager
               -> [CompanyDatatypes.Unit] -> CompanyDatatypes.Dept)
            $dData_r3dT
            (w3_s2kI
               @ (CompanyDatatypes.Name
                  -> CompanyDatatypes.Manager
                  -> [CompanyDatatypes.Unit]
                  -> CompanyDatatypes.Dept)
               CompanyDatatypes.D)))

CompanyDatatypes.$w$cgfoldl2 [Occ=LoopBreaker]
  :: forall (c_aV0 :: * -> *).
     (forall d_aV1 b_aV2.
      Data.Data.Data d_aV1 =>
      c_aV0 (d_aV1 -> b_aV2) -> d_aV1 -> c_aV0 b_aV2)
     -> (forall g_aV3. g_aV3 -> c_aV0 g_aV3)
     -> CompanyDatatypes.Name
     -> CompanyDatatypes.Manager
     -> [CompanyDatatypes.Unit]
     -> c_aV0 CompanyDatatypes.Dept
[GblId, Arity=5, Str=DmdType C(C(C(S)))LLLL]
CompanyDatatypes.$w$cgfoldl2 =
  \ (@ (c_aV0 :: * -> *))
    (w_s2kO
       :: forall d_aV1 b_aV2.
          Data.Data.Data d_aV1 =>
          c_aV0 (d_aV1 -> b_aV2) -> d_aV1 -> c_aV0 b_aV2)
    (w3_s2kP :: forall g_aV3. g_aV3 -> c_aV0 g_aV3)
    (ww_s2kS :: CompanyDatatypes.Name)
    (ww1_s2kT :: CompanyDatatypes.Manager)
    (ww2_s2kU :: [CompanyDatatypes.Unit]) ->
    w_s2kO
      @ [CompanyDatatypes.Unit]
      @ CompanyDatatypes.Dept
      CompanyDatatypes.$fDataDept_$dData
      (w_s2kO
         @ CompanyDatatypes.Manager
         @ ([CompanyDatatypes.Unit] -> CompanyDatatypes.Dept)
         CompanyDatatypes.$fDataEmployee
         (w_s2kO
            @ CompanyDatatypes.Name
            @ (CompanyDatatypes.Manager
               -> [CompanyDatatypes.Unit] -> CompanyDatatypes.Dept)
            CompanyDatatypes.$fDataDept_$dData1
            (w3_s2kP
               @ (CompanyDatatypes.Name
                  -> CompanyDatatypes.Manager
                  -> [CompanyDatatypes.Unit]
                  -> CompanyDatatypes.Dept)
               CompanyDatatypes.D)
            ww_s2kS)
         ww1_s2kT)
      ww2_s2kU

CompanyDatatypes.$fDataUnit2 [Occ=LoopBreaker]
  :: (forall b_a1r8. Data.Data.Data b_a1r8 => b_a1r8 -> b_a1r8)
     -> CompanyDatatypes.Unit -> Data.Data.ID CompanyDatatypes.Unit
[GblId, Arity=2, Str=DmdType LS]
CompanyDatatypes.$fDataUnit2 =
  \ (f_a1r7
       :: forall b_a1r8. Data.Data.Data b_a1r8 => b_a1r8 -> b_a1r8)
    (x0_a1r9 :: CompanyDatatypes.Unit) ->
    case x0_a1r9 of _ {
      CompanyDatatypes.PU a22_aSQ ->
        (CompanyDatatypes.PU
           (f_a1r7
              @ CompanyDatatypes.Employee
              CompanyDatatypes.$fDataEmployee
              a22_aSQ))
        `cast` (Sym <(Data.Data.NTCo:ID <CompanyDatatypes.Unit>)>
                :: CompanyDatatypes.Unit ~# Data.Data.ID CompanyDatatypes.Unit);
      CompanyDatatypes.DU a22_aST ->
        (CompanyDatatypes.DU
           (f_a1r7
              @ CompanyDatatypes.Dept CompanyDatatypes.$fDataDept a22_aST))
        `cast` (Sym <(Data.Data.NTCo:ID <CompanyDatatypes.Unit>)>
                :: CompanyDatatypes.Unit ~# Data.Data.ID CompanyDatatypes.Unit)
    }

CompanyDatatypes.$w$cgunfold [Occ=LoopBreaker]
  :: forall (c_aV9 :: * -> *).
     (forall b_aVa r_aVb.
      Data.Data.Data b_aVa =>
      c_aV9 (b_aVa -> r_aVb) -> c_aV9 r_aVb)
     -> (forall r_aVc. r_aVc -> c_aV9 r_aVc)
     -> Data.Data.ConstrRep
     -> c_aV9 CompanyDatatypes.Unit
[GblId, Arity=3, Str=DmdType C(C(S))LS]
CompanyDatatypes.$w$cgunfold =
  \ (@ (c_aV9 :: * -> *))
    (w_s2l0
       :: forall b_aVa r_aVb.
          Data.Data.Data b_aVa =>
          c_aV9 (b_aVa -> r_aVb) -> c_aV9 r_aVb)
    (w3_s2l1 :: forall r_aVc. r_aVc -> c_aV9 r_aVc)
    (ww_s2l4 :: Data.Data.ConstrRep) ->
    case ww_s2l4 of _ {
      __DEFAULT -> case Data.Data.$fData()5 of wild_00 { };
      Data.Data.AlgConstr idx_a16C ->
        case idx_a16C of _ { GHC.Types.I# ds_d15H ->
        case ds_d15H of _ {
          __DEFAULT ->
            w_s2l0
              @ CompanyDatatypes.Dept
              @ CompanyDatatypes.Unit
              CompanyDatatypes.$fDataDept
              (w3_s2l1
                 @ (CompanyDatatypes.Dept -> CompanyDatatypes.Unit)
                 CompanyDatatypes.DU);
          1 ->
            w_s2l0
              @ CompanyDatatypes.Employee
              @ CompanyDatatypes.Unit
              CompanyDatatypes.$fDataEmployee
              (w3_s2l1
                 @ (CompanyDatatypes.Employee -> CompanyDatatypes.Unit)
                 CompanyDatatypes.PU)
        }
        }
    }

CompanyDatatypes.$fDataUnit_$cgfoldl [Occ=LoopBreaker]
  :: forall (c_aV0 :: * -> *).
     (forall d_aV1 b_aV2.
      Data.Data.Data d_aV1 =>
      c_aV0 (d_aV1 -> b_aV2) -> d_aV1 -> c_aV0 b_aV2)
     -> (forall g_aV3. g_aV3 -> c_aV0 g_aV3)
     -> CompanyDatatypes.Unit
     -> c_aV0 CompanyDatatypes.Unit
[GblId, Arity=3, Str=DmdType C(C(C(S)))LS]
CompanyDatatypes.$fDataUnit_$cgfoldl =
  \ (@ (c_t2D :: * -> *))
    (k_aSO
       :: forall d_aV1 b_aV2.
          Data.Data.Data d_aV1 =>
          c_t2D (d_aV1 -> b_aV2) -> d_aV1 -> c_t2D b_aV2)
    (z_aSP :: forall g_aV3. g_aV3 -> c_t2D g_aV3)
    (ds_d15D :: CompanyDatatypes.Unit) ->
    case ds_d15D of _ {
      CompanyDatatypes.PU a22_aSQ ->
        k_aSO
          @ CompanyDatatypes.Employee
          @ CompanyDatatypes.Unit
          CompanyDatatypes.$fDataEmployee
          (z_aSP
             @ (CompanyDatatypes.Employee -> CompanyDatatypes.Unit)
             CompanyDatatypes.PU)
          a22_aSQ;
      CompanyDatatypes.DU a22_aST ->
        k_aSO
          @ CompanyDatatypes.Dept
          @ CompanyDatatypes.Unit
          CompanyDatatypes.$fDataDept
          (z_aSP
             @ (CompanyDatatypes.Dept -> CompanyDatatypes.Unit)
             CompanyDatatypes.DU)
          a22_aST
    }
end Rec }

CompanyDatatypes.$fDataCompany2
  :: [CompanyDatatypes.Dept] -> Data.Typeable.Internal.TypeRep
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=False, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 30 0}]
CompanyDatatypes.$fDataCompany2 =
  Data.Typeable.Internal.typeOfDefault
    @ []
    @ CompanyDatatypes.Dept
    (Data.Typeable.Internal.$fTypeable1[]_$ctypeOf1
     `cast` (Sym <(Data.Typeable.Internal.NTCo:Typeable1 <[]>)>
             :: (forall a_a1GP. [a_a1GP] -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable1 []))
    (CompanyDatatypes.$fTypeableDept_$ctypeOf
     `cast` (Sym
               <(Data.Typeable.Internal.NTCo:Typeable <CompanyDatatypes.Dept>)>
             :: (CompanyDatatypes.Dept -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable CompanyDatatypes.Dept))

CompanyDatatypes.$fDataCompany_$dData
  :: Data.Data.Data [CompanyDatatypes.Dept]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 30 0}]
CompanyDatatypes.$fDataCompany_$dData =
  Data.Data.$fData[]
    @ CompanyDatatypes.Dept
    (CompanyDatatypes.$fDataCompany2
     `cast` (Sym
               <(Data.Typeable.Internal.NTCo:Typeable <[CompanyDatatypes.Dept]>)>
             :: ([CompanyDatatypes.Dept] -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable [CompanyDatatypes.Dept]))
    CompanyDatatypes.$fDataDept

CompanyDatatypes.$fDataCompany_$cgfoldl
  :: forall (c_aV0 :: * -> *).
     (forall d_aV1 b_aV2.
      Data.Data.Data d_aV1 =>
      c_aV0 (d_aV1 -> b_aV2) -> d_aV1 -> c_aV0 b_aV2)
     -> (forall g_aV3. g_aV3 -> c_aV0 g_aV3)
     -> CompanyDatatypes.Company
     -> c_aV0 CompanyDatatypes.Company
[GblId,
 Arity=3,
 Str=DmdType C(C(C(S)))LU(L),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=3, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (c_t45 :: * -> *))
                 (k_X100 [Occ=Once!]
                    :: forall d_aV1 b_aV2.
                       Data.Data.Data d_aV1 =>
                       c_t45 (d_aV1 -> b_aV2) -> d_aV1 -> c_t45 b_aV2)
                 (z_X102 [Occ=Once!] :: forall g_aV3. g_aV3 -> c_t45 g_aV3)
                 (ds_X1cS [Occ=Once!] :: CompanyDatatypes.Company) ->
                 case ds_X1cS of _ { CompanyDatatypes.C a22_aTo [Occ=Once] ->
                 k_X100
                   @ [CompanyDatatypes.Dept]
                   @ CompanyDatatypes.Company
                   CompanyDatatypes.$fDataCompany_$dData
                   (z_X102
                      @ ([CompanyDatatypes.Dept] -> CompanyDatatypes.Company)
                      CompanyDatatypes.C)
                   a22_aTo
                 }}]
CompanyDatatypes.$fDataCompany_$cgfoldl =
  \ (@ (c_t45 :: * -> *))
    (k_X100
       :: forall d_aV1 b_aV2.
          Data.Data.Data d_aV1 =>
          c_t45 (d_aV1 -> b_aV2) -> d_aV1 -> c_t45 b_aV2)
    (z_X102 :: forall g_aV3. g_aV3 -> c_t45 g_aV3)
    (ds_X1cS :: CompanyDatatypes.Company) ->
    case ds_X1cS of _ { CompanyDatatypes.C a22_aTo ->
    k_X100
      @ [CompanyDatatypes.Dept]
      @ CompanyDatatypes.Company
      CompanyDatatypes.$fDataCompany_$dData
      (z_X102
         @ ([CompanyDatatypes.Dept] -> CompanyDatatypes.Company)
         CompanyDatatypes.C)
      a22_aTo
    }

CompanyDatatypes.$fDataCompany_$dData1
  :: Data.Data.Data [CompanyDatatypes.Dept]
[GblId,
 Str=DmdType,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=False,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 30 0}]
CompanyDatatypes.$fDataCompany_$dData1 =
  Data.Data.$fData[]
    @ CompanyDatatypes.Dept
    (CompanyDatatypes.$fDataCompany2
     `cast` (Sym
               <(Data.Typeable.Internal.NTCo:Typeable <[CompanyDatatypes.Dept]>)>
             :: ([CompanyDatatypes.Dept] -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable [CompanyDatatypes.Dept]))
    CompanyDatatypes.$fDataDept

CompanyDatatypes.$fDataCompany_$cgunfold
  :: forall (c_aV9 :: * -> *).
     (forall b_aVa r_aVb.
      Data.Data.Data b_aVa =>
      c_aV9 (b_aVa -> r_aVb) -> c_aV9 r_aVb)
     -> (forall r_aVc. r_aVc -> c_aV9 r_aVc)
     -> Data.Data.Constr
     -> c_aV9 CompanyDatatypes.Company
[GblId,
 Arity=3,
 Str=DmdType C(C(S))LA,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=3, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (c_t49 :: * -> *))
                 (k_X106 [Occ=Once!]
                    :: forall b_aVa r_aVb.
                       Data.Data.Data b_aVa =>
                       c_t49 (b_aVa -> r_aVb) -> c_t49 r_aVb)
                 (z_X108 [Occ=Once!] :: forall r_aVc. r_aVc -> c_t49 r_aVc)
                 _ ->
                 k_X106
                   @ [CompanyDatatypes.Dept]
                   @ CompanyDatatypes.Company
                   CompanyDatatypes.$fDataCompany_$dData1
                   (z_X108
                      @ ([CompanyDatatypes.Dept] -> CompanyDatatypes.Company)
                      CompanyDatatypes.C)}]
CompanyDatatypes.$fDataCompany_$cgunfold =
  \ (@ (c_t49 :: * -> *))
    (k_X106
       :: forall b_aVa r_aVb.
          Data.Data.Data b_aVa =>
          c_t49 (b_aVa -> r_aVb) -> c_t49 r_aVb)
    (z_X108 :: forall r_aVc. r_aVc -> c_t49 r_aVc)
    _ ->
    k_X106
      @ [CompanyDatatypes.Dept]
      @ CompanyDatatypes.Company
      CompanyDatatypes.$fDataCompany_$dData1
      (z_X108
         @ ([CompanyDatatypes.Dept] -> CompanyDatatypes.Company)
         CompanyDatatypes.C)

CompanyDatatypes.$fDataCompany1
  :: ([CompanyDatatypes.Dept] -> CompanyDatatypes.Company,
      GHC.Types.Bool)
[GblId,
 Caf=NoCafRefs,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=0, Value=True,
         ConLike=True, WorkFree=False, Expandable=True,
         Guidance=IF_ARGS [] 10 30}]
CompanyDatatypes.$fDataCompany1 =
  (CompanyDatatypes.C, GHC.Types.False)

CompanyDatatypes.$w$cgmapMo
  :: forall (m_aY8 :: * -> *).
     GHC.Base.Monad m_aY8 =>
     (forall a_a1nd. m_aY8 a_a1nd)
     -> (forall a_a1nc. m_aY8 a_a1nc -> m_aY8 a_a1nc -> m_aY8 a_a1nc)
     -> (forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
     -> CompanyDatatypes.Company
     -> m_aY8 CompanyDatatypes.Company
[GblId,
 Arity=5,
 Str=DmdType SLLLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=5, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [20 0 60 60 20] 460 0}]
CompanyDatatypes.$w$cgmapMo =
  \ (@ (m_aY8 :: * -> *))
    (ww_s2lE :: GHC.Base.Monad m_aY8)
    (ww1_s2lF :: forall a_a1nd. m_aY8 a_a1nd)
    (ww2_s2lG
       :: forall a_a1nc. m_aY8 a_a1nc -> m_aY8 a_a1nc -> m_aY8 a_a1nc)
    (w_s2lI
       :: forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
    (w3_s2lJ :: CompanyDatatypes.Company) ->
    case ww_s2lE
    of _ { GHC.Base.D:Monad ww3_s2lu ww4_s2lv ww5_s2lw ww6_s2lx ->
    ww3_s2lu
      @ (CompanyDatatypes.Company, GHC.Types.Bool)
      @ CompanyDatatypes.Company
      (case w3_s2lJ of _ { CompanyDatatypes.C a22_aTo ->
       let {
         lvl11_s1FS :: m_aY8 [CompanyDatatypes.Dept]
         [LclId, Str=DmdType]
         lvl11_s1FS =
           w_s2lI
             @ [CompanyDatatypes.Dept]
             CompanyDatatypes.$fDataCompany_$dData
             a22_aTo } in
       ww3_s2lu
         @ ([CompanyDatatypes.Dept] -> CompanyDatatypes.Company,
            GHC.Types.Bool)
         @ (CompanyDatatypes.Company, GHC.Types.Bool)
         (ww5_s2lw
            @ ([CompanyDatatypes.Dept] -> CompanyDatatypes.Company,
               GHC.Types.Bool)
            CompanyDatatypes.$fDataCompany1)
         (\ (ds1_a1mK
               :: ([CompanyDatatypes.Dept] -> CompanyDatatypes.Company,
                   GHC.Types.Bool)) ->
            case ds1_a1mK of _ { (h_a1mN, b_a1mO) ->
            case b_a1mO of _ {
              GHC.Types.False ->
                ww2_s2lG
                  @ (CompanyDatatypes.Company, GHC.Types.Bool)
                  (ww3_s2lu
                     @ [CompanyDatatypes.Dept]
                     @ (CompanyDatatypes.Company, GHC.Types.Bool)
                     lvl11_s1FS
                     (\ (y'_a1mT :: [CompanyDatatypes.Dept]) ->
                        ww5_s2lw
                          @ (CompanyDatatypes.Company, GHC.Types.Bool)
                          (h_a1mN y'_a1mT, GHC.Types.True)))
                  (ww5_s2lw
                     @ (CompanyDatatypes.Company, GHC.Types.Bool)
                     (h_a1mN a22_aTo, GHC.Types.False));
              GHC.Types.True ->
                ww5_s2lw
                  @ (CompanyDatatypes.Company, GHC.Types.Bool)
                  (h_a1mN a22_aTo, GHC.Types.True)
            }
            })
       })
      (\ (ds_a1n1 :: (CompanyDatatypes.Company, GHC.Types.Bool)) ->
         case ds_a1n1 of _ { (x'_a1n4, b_a1n5) ->
         case b_a1n5 of _ {
           GHC.Types.False -> ww1_s2lF @ CompanyDatatypes.Company;
           GHC.Types.True -> ww5_s2lw @ CompanyDatatypes.Company x'_a1n4
         }
         })
    }

CompanyDatatypes.$fDataCompany_$cgmapMo [InlPrag=INLINE[0]]
  :: forall (m_aY8 :: * -> *).
     Control.Monad.MonadPlus m_aY8 =>
     (forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
     -> CompanyDatatypes.Company -> m_aY8 CompanyDatatypes.Company
[GblId,
 Arity=3,
 Str=DmdType U(SLL)LL,
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapMo, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (m_aY8 :: * -> *))
                 (w_s2lC [Occ=Once!] :: Control.Monad.MonadPlus m_aY8)
                 (w3_s2lI [Occ=Once]
                    :: forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
                 (w4_s2lJ [Occ=Once] :: CompanyDatatypes.Company) ->
                 case w_s2lC
                 of _
                 { Control.Monad.D:MonadPlus ww_s2lE [Occ=Once]
                                             ww1_s2lF [Occ=Once]
                                             ww2_s2lG [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapMo
                   @ m_aY8 ww_s2lE ww1_s2lF ww2_s2lG w3_s2lI w4_s2lJ
                 }}]
CompanyDatatypes.$fDataCompany_$cgmapMo =
  \ (@ (m_aY8 :: * -> *))
    (w_s2lC :: Control.Monad.MonadPlus m_aY8)
    (w3_s2lI
       :: forall d_aY9. Data.Data.Data d_aY9 => d_aY9 -> m_aY8 d_aY9)
    (w4_s2lJ :: CompanyDatatypes.Company) ->
    case w_s2lC
    of _ { Control.Monad.D:MonadPlus ww_s2lE ww1_s2lF ww2_s2lG ->
    CompanyDatatypes.$w$cgmapMo
      @ m_aY8 ww_s2lE ww1_s2lF ww2_s2lG w3_s2lI w4_s2lJ
    }

CompanyDatatypes.$w$cgmapMp5
  :: forall (m_aXe :: * -> *).
     GHC.Base.Monad m_aXe =>
     (forall a_a1nd. m_aXe a_a1nd)
     -> (forall a_a1nc. m_aXe a_a1nc -> m_aXe a_a1nc -> m_aXe a_a1nc)
     -> (forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
     -> CompanyDatatypes.Company
     -> m_aXe CompanyDatatypes.Company
[GblId,
 Arity=5,
 Str=DmdType SLLLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=5, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [20 0 60 60 20] 390 0}]
CompanyDatatypes.$w$cgmapMp5 =
  \ (@ (m_aXe :: * -> *))
    (ww_s2lW :: GHC.Base.Monad m_aXe)
    (ww1_s2lX :: forall a_a1nd. m_aXe a_a1nd)
    (ww2_s2lY
       :: forall a_a1nc. m_aXe a_a1nc -> m_aXe a_a1nc -> m_aXe a_a1nc)
    (w_s2m0
       :: forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
    (w3_s2m1 :: CompanyDatatypes.Company) ->
    case ww_s2lW
    of _ { GHC.Base.D:Monad ww3_s2lM ww4_s2lN ww5_s2lO ww6_s2lP ->
    ww3_s2lM
      @ (CompanyDatatypes.Company, GHC.Types.Bool)
      @ CompanyDatatypes.Company
      (case w3_s2m1 of _ { CompanyDatatypes.C a22_aTo ->
       let {
         lvl11_s1FU [Dmd=Just L] :: m_aXe [CompanyDatatypes.Dept]
         [LclId, Str=DmdType]
         lvl11_s1FU =
           w_s2m0
             @ [CompanyDatatypes.Dept]
             CompanyDatatypes.$fDataCompany_$dData
             a22_aTo } in
       ww3_s2lM
         @ ([CompanyDatatypes.Dept] -> CompanyDatatypes.Company,
            GHC.Types.Bool)
         @ (CompanyDatatypes.Company, GHC.Types.Bool)
         (ww5_s2lO
            @ ([CompanyDatatypes.Dept] -> CompanyDatatypes.Company,
               GHC.Types.Bool)
            CompanyDatatypes.$fDataCompany1)
         (\ (ds1_a1nF
               :: ([CompanyDatatypes.Dept] -> CompanyDatatypes.Company,
                   GHC.Types.Bool)) ->
            case ds1_a1nF of _ { (h_a1nI, b_a1nJ) ->
            ww2_s2lY
              @ (CompanyDatatypes.Company, GHC.Types.Bool)
              (ww3_s2lM
                 @ [CompanyDatatypes.Dept]
                 @ (CompanyDatatypes.Company, GHC.Types.Bool)
                 lvl11_s1FU
                 (\ (y'_a1nL :: [CompanyDatatypes.Dept]) ->
                    ww5_s2lO
                      @ (CompanyDatatypes.Company, GHC.Types.Bool)
                      (h_a1nI y'_a1nL, GHC.Types.True)))
              (ww5_s2lO
                 @ (CompanyDatatypes.Company, GHC.Types.Bool)
                 (h_a1nI a22_aTo, b_a1nJ))
            })
       })
      (\ (ds_a1nR :: (CompanyDatatypes.Company, GHC.Types.Bool)) ->
         case ds_a1nR of _ { (x'_a1nU, b_a1nV) ->
         case b_a1nV of _ {
           GHC.Types.False -> ww1_s2lX @ CompanyDatatypes.Company;
           GHC.Types.True -> ww5_s2lO @ CompanyDatatypes.Company x'_a1nU
         }
         })
    }

CompanyDatatypes.$fDataCompany_$cgmapMp [InlPrag=INLINE[0]]
  :: forall (m_aXe :: * -> *).
     Control.Monad.MonadPlus m_aXe =>
     (forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
     -> CompanyDatatypes.Company -> m_aXe CompanyDatatypes.Company
[GblId,
 Arity=3,
 Str=DmdType U(SLL)LL,
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapMp5, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (m_aXe :: * -> *))
                 (w_s2lU [Occ=Once!] :: Control.Monad.MonadPlus m_aXe)
                 (w3_s2m0 [Occ=Once]
                    :: forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
                 (w4_s2m1 [Occ=Once] :: CompanyDatatypes.Company) ->
                 case w_s2lU
                 of _
                 { Control.Monad.D:MonadPlus ww_s2lW [Occ=Once]
                                             ww1_s2lX [Occ=Once]
                                             ww2_s2lY [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapMp5
                   @ m_aXe ww_s2lW ww1_s2lX ww2_s2lY w3_s2m0 w4_s2m1
                 }}]
CompanyDatatypes.$fDataCompany_$cgmapMp =
  \ (@ (m_aXe :: * -> *))
    (w_s2lU :: Control.Monad.MonadPlus m_aXe)
    (w3_s2m0
       :: forall d_aY1. Data.Data.Data d_aY1 => d_aY1 -> m_aXe d_aY1)
    (w4_s2m1 :: CompanyDatatypes.Company) ->
    case w_s2lU
    of _ { Control.Monad.D:MonadPlus ww_s2lW ww1_s2lX ww2_s2lY ->
    CompanyDatatypes.$w$cgmapMp5
      @ m_aXe ww_s2lW ww1_s2lX ww2_s2lY w3_s2m0 w4_s2m1
    }

CompanyDatatypes.$w$cgmapM5
  :: forall (m_aX4 :: * -> *).
     (forall a_a1ne b_a1nf.
      m_aX4 a_a1ne -> (a_a1ne -> m_aX4 b_a1nf) -> m_aX4 b_a1nf)
     -> (forall a_a1ni. a_a1ni -> m_aX4 a_a1ni)
     -> (forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
     -> [CompanyDatatypes.Dept]
     -> m_aX4 CompanyDatatypes.Company
[GblId,
 Arity=4,
 Str=DmdType SLLL,
 Unf=Unf{Src=<vanilla>, TopLvl=True, Arity=4, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=IF_ARGS [120 120 60 0] 180 0}]
CompanyDatatypes.$w$cgmapM5 =
  \ (@ (m_aX4 :: * -> *))
    (ww_s2m8
       :: forall a_a1ne b_a1nf.
          m_aX4 a_a1ne -> (a_a1ne -> m_aX4 b_a1nf) -> m_aX4 b_a1nf)
    (ww1_s2ma :: forall a_a1ni. a_a1ni -> m_aX4 a_a1ni)
    (w_s2md
       :: forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
    (ww2_s2mg :: [CompanyDatatypes.Dept]) ->
    let {
      lvl11_s1FV [Dmd=Just L] :: m_aX4 [CompanyDatatypes.Dept]
      [LclId, Str=DmdType]
      lvl11_s1FV =
        w_s2md
          @ [CompanyDatatypes.Dept]
          CompanyDatatypes.$fDataCompany_$dData
          ww2_s2mg } in
    ww_s2m8
      @ ([CompanyDatatypes.Dept] -> CompanyDatatypes.Company)
      @ CompanyDatatypes.Company
      (ww1_s2ma
         @ ([CompanyDatatypes.Dept] -> CompanyDatatypes.Company)
         CompanyDatatypes.C)
      (\ (c'_a1og
            :: [CompanyDatatypes.Dept] -> CompanyDatatypes.Company) ->
         ww_s2m8
           @ [CompanyDatatypes.Dept]
           @ CompanyDatatypes.Company
           lvl11_s1FV
           (\ (x'_a1oh :: [CompanyDatatypes.Dept]) ->
              ww1_s2ma @ CompanyDatatypes.Company (c'_a1og x'_a1oh)))

CompanyDatatypes.$fDataCompany_$cgmapM [InlPrag=INLINE[0]]
  :: forall (m_aX4 :: * -> *).
     GHC.Base.Monad m_aX4 =>
     (forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
     -> CompanyDatatypes.Company -> m_aX4 CompanyDatatypes.Company
[GblId,
 Arity=3,
 Str=DmdType U(SALA)LU(L),
 Unf=Unf{Src=Worker=CompanyDatatypes.$w$cgmapM5, TopLvl=True,
         Arity=3, Value=True, ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ (m_aX4 :: * -> *))
                 (w_s2m6 [Occ=Once!] :: GHC.Base.Monad m_aX4)
                 (w3_s2md [Occ=Once]
                    :: forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
                 (w4_s2me [Occ=Once!] :: CompanyDatatypes.Company) ->
                 case w_s2m6
                 of _
                 { GHC.Base.D:Monad ww_s2m8 [Occ=Once] _ ww2_s2ma [Occ=Once] _ ->
                 case w4_s2me of _ { CompanyDatatypes.C ww4_s2mg [Occ=Once] ->
                 CompanyDatatypes.$w$cgmapM5
                   @ m_aX4 ww_s2m8 ww2_s2ma w3_s2md ww4_s2mg
                 }
                 }}]
CompanyDatatypes.$fDataCompany_$cgmapM =
  \ (@ (m_aX4 :: * -> *))
    (w_s2m6 :: GHC.Base.Monad m_aX4)
    (w3_s2md
       :: forall d_aX7. Data.Data.Data d_aX7 => d_aX7 -> m_aX4 d_aX7)
    (w4_s2me :: CompanyDatatypes.Company) ->
    case w_s2m6
    of _ { GHC.Base.D:Monad ww_s2m8 ww1_s2m9 ww2_s2ma ww3_s2mb ->
    case w4_s2me of _ { CompanyDatatypes.C ww4_s2mg ->
    CompanyDatatypes.$w$cgmapM5
      @ m_aX4 ww_s2m8 ww2_s2ma w3_s2md ww4_s2mg
    }
    }

CompanyDatatypes.$fDataCompany_$cgmapQi
  :: forall u_aWW.
     GHC.Types.Int
     -> (forall d_aWX. Data.Data.Data d_aWX => d_aWX -> u_aWW)
     -> CompanyDatatypes.Company
     -> u_aWW
[GblId,
 Arity=3,
 Str=DmdType U(L)C(C(S))U(L),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=3, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ u_a1ol)
                 (i_a1om [Occ=Once!] :: GHC.Types.Int)
                 (f_a1on [Occ=Once!]
                    :: forall d_a1oo. Data.Data.Data d_a1oo => d_a1oo -> u_a1ol)
                 (x_a1op [Occ=Once!] :: CompanyDatatypes.Company) ->
                 case x_a1op of _ { CompanyDatatypes.C a22_aTo [Occ=Once] ->
                 case i_a1om of _ { GHC.Types.I# x1_a1p2 [Occ=Once!] ->
                 case x1_a1p2 of _ {
                   __DEFAULT -> Data.Maybe.fromJust1 @ u_a1ol;
                   0 ->
                     f_a1on
                       @ [CompanyDatatypes.Dept]
                       CompanyDatatypes.$fDataCompany_$dData
                       a22_aTo
                 }
                 }
                 }}]
CompanyDatatypes.$fDataCompany_$cgmapQi =
  \ (@ u_a1ol)
    (i_a1om :: GHC.Types.Int)
    (f_a1on
       :: forall d_a1oo. Data.Data.Data d_a1oo => d_a1oo -> u_a1ol)
    (x_a1op :: CompanyDatatypes.Company) ->
    case x_a1op of _ { CompanyDatatypes.C a22_aTo ->
    case i_a1om of _ { GHC.Types.I# x1_a1p2 ->
    case x1_a1p2 of _ {
      __DEFAULT -> Data.Maybe.fromJust1 @ u_a1ol;
      0 ->
        f_a1on
          @ [CompanyDatatypes.Dept]
          CompanyDatatypes.$fDataCompany_$dData
          a22_aTo
    }
    }
    }

CompanyDatatypes.$fDataCompany_$cgmapQr
  :: forall r_aWE r'_aWF.
     (r'_aWF -> r_aWE -> r_aWE)
     -> r_aWE
     -> (forall d_aWG. Data.Data.Data d_aWG => d_aWG -> r'_aWF)
     -> CompanyDatatypes.Company
     -> r_aWE
[GblId,
 Arity=4,
 Str=DmdType C(C(S))LLU(L),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=4, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ r_a1pQ)
                 (@ r'_a1pR)
                 (o_a1pS [Occ=Once!] :: r'_a1pR -> r_a1pQ -> r_a1pQ)
                 (r0_a1pT [Occ=Once] :: r_a1pQ)
                 (f_a1pU [Occ=Once!]
                    :: forall d_a1pV. Data.Data.Data d_a1pV => d_a1pV -> r'_a1pR)
                 (x0_a1pW [Occ=Once!] :: CompanyDatatypes.Company) ->
                 case x0_a1pW of _ { CompanyDatatypes.C a22_aTo [Occ=Once] ->
                 o_a1pS
                   (f_a1pU
                      @ [CompanyDatatypes.Dept]
                      CompanyDatatypes.$fDataCompany_$dData
                      a22_aTo)
                   r0_a1pT
                 }}]
CompanyDatatypes.$fDataCompany_$cgmapQr =
  \ (@ r_a1pQ)
    (@ r'_a1pR)
    (o_a1pS :: r'_a1pR -> r_a1pQ -> r_a1pQ)
    (r0_a1pT :: r_a1pQ)
    (f_a1pU
       :: forall d_a1pV. Data.Data.Data d_a1pV => d_a1pV -> r'_a1pR)
    (x0_a1pW :: CompanyDatatypes.Company) ->
    case x0_a1pW of _ { CompanyDatatypes.C a22_aTo ->
    o_a1pS
      (f_a1pU
         @ [CompanyDatatypes.Dept]
         CompanyDatatypes.$fDataCompany_$dData
         a22_aTo)
      r0_a1pT
    }

CompanyDatatypes.$fDataCompany_$cgmapQ
  :: forall u_aWO.
     (forall d_aWP. Data.Data.Data d_aWP => d_aWP -> u_aWO)
     -> CompanyDatatypes.Company -> [u_aWO]
[GblId,
 Arity=2,
 Str=DmdType LU(L),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ u_a1pL)
                 (f_a1pM [Occ=Once!]
                    :: forall d_a1pN. Data.Data.Data d_a1pN => d_a1pN -> u_a1pL)
                 (eta_XcE [Occ=Once!] :: CompanyDatatypes.Company) ->
                 case eta_XcE of _ { CompanyDatatypes.C a22_aTo [Occ=Once] ->
                 GHC.Types.:
                   @ u_a1pL
                   (f_a1pM
                      @ [CompanyDatatypes.Dept]
                      CompanyDatatypes.$fDataCompany_$dData
                      a22_aTo)
                   (GHC.Types.[] @ u_a1pL)
                 }}]
CompanyDatatypes.$fDataCompany_$cgmapQ =
  \ (@ u_a1pL)
    (f_a1pM
       :: forall d_a1pN. Data.Data.Data d_a1pN => d_a1pN -> u_a1pL)
    (eta_XcE :: CompanyDatatypes.Company) ->
    case eta_XcE of _ { CompanyDatatypes.C a22_aTo ->
    GHC.Types.:
      @ u_a1pL
      (f_a1pM
         @ [CompanyDatatypes.Dept]
         CompanyDatatypes.$fDataCompany_$dData
         a22_aTo)
      (GHC.Types.[] @ u_a1pL)
    }

CompanyDatatypes.$fDataCompany_$cgmapQl
  :: forall r_aWu r'_aWv.
     (r_aWu -> r'_aWv -> r_aWu)
     -> r_aWu
     -> (forall d_aWw. Data.Data.Data d_aWw => d_aWw -> r'_aWv)
     -> CompanyDatatypes.Company
     -> r_aWu
[GblId,
 Arity=4,
 Str=DmdType C(C(S))LLU(L),
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=4, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (@ r_X1D5)
                 (@ r'_X1D7)
                 (o_X1D9 [Occ=Once!] :: r_X1D5 -> r'_X1D7 -> r_X1D5)
                 (r_X1Db [Occ=Once] :: r_X1D5)
                 (f_X1Dd [Occ=Once!]
                    :: forall d_a1qy. Data.Data.Data d_a1qy => d_a1qy -> r'_X1D7)
                 (eta_XcI [Occ=Once!] :: CompanyDatatypes.Company) ->
                 case eta_XcI of _ { CompanyDatatypes.C a22_aTo [Occ=Once] ->
                 o_X1D9
                   r_X1Db
                   (f_X1Dd
                      @ [CompanyDatatypes.Dept]
                      CompanyDatatypes.$fDataCompany_$dData
                      a22_aTo)
                 }}]
CompanyDatatypes.$fDataCompany_$cgmapQl =
  \ (@ r_X1D5)
    (@ r'_X1D7)
    (o_X1D9 :: r_X1D5 -> r'_X1D7 -> r_X1D5)
    (r_X1Db :: r_X1D5)
    (f_X1Dd
       :: forall d_a1qy. Data.Data.Data d_a1qy => d_a1qy -> r'_X1D7)
    (eta_XcI :: CompanyDatatypes.Company) ->
    case eta_XcI of _ { CompanyDatatypes.C a22_aTo ->
    o_X1D9
      r_X1Db
      (f_X1Dd
         @ [CompanyDatatypes.Dept]
         CompanyDatatypes.$fDataCompany_$dData
         a22_aTo)
    }

CompanyDatatypes.$fDataCompany_$cgmapT
  :: (forall b_aWo. Data.Data.Data b_aWo => b_aWo -> b_aWo)
     -> CompanyDatatypes.Company -> CompanyDatatypes.Company
[GblId,
 Arity=2,
 Str=DmdType LU(L)m,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=False)
         Tmpl= \ (f_X1DL [Occ=Once!]
                    :: forall b_a1r8. Data.Data.Data b_a1r8 => b_a1r8 -> b_a1r8)
                 (x0_X1DO [Occ=Once!] :: CompanyDatatypes.Company) ->
                 case x0_X1DO of _ { CompanyDatatypes.C a22_aTo [Occ=Once] ->
                 CompanyDatatypes.C
                   (f_X1DL
                      @ [CompanyDatatypes.Dept]
                      CompanyDatatypes.$fDataCompany_$dData
                      a22_aTo)
                 }}]
CompanyDatatypes.$fDataCompany_$cgmapT =
  \ (f_X1DL
       :: forall b_a1r8. Data.Data.Data b_a1r8 => b_a1r8 -> b_a1r8)
    (x0_X1DO :: CompanyDatatypes.Company) ->
    case x0_X1DO of _ { CompanyDatatypes.C a22_aTo ->
    CompanyDatatypes.C
      (f_X1DL
         @ [CompanyDatatypes.Dept]
         CompanyDatatypes.$fDataCompany_$dData
         a22_aTo)
    }

CompanyDatatypes.$fDataCompany_$cdataCast2
  :: forall (c_aWc :: * -> *) (t_aWd :: * -> * -> *).
     Data.Typeable.Internal.Typeable2 t_aWd =>
     (forall d_aWe e_aWf.
      (Data.Data.Data d_aWe, Data.Data.Data e_aWf) =>
      c_aWc (t_aWd d_aWe e_aWf))
     -> Data.Maybe.Maybe (c_aWc CompanyDatatypes.Company)
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType AA,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ (@ (c_a1rt :: * -> *)) (@ (t_a1ru :: * -> * -> *)) _ _ ->
                 Data.Maybe.Nothing @ (c_a1rt CompanyDatatypes.Company)}]
CompanyDatatypes.$fDataCompany_$cdataCast2 =
  \ (@ (c_a1rt :: * -> *)) (@ (t_a1ru :: * -> * -> *)) _ _ ->
    Data.Maybe.Nothing @ (c_a1rt CompanyDatatypes.Company)

CompanyDatatypes.$fDataCompany_$cdataCast1
  :: forall (c_aVp :: * -> *) (t_aVq :: * -> *).
     Data.Typeable.Internal.Typeable1 t_aVq =>
     (forall d_aVr. Data.Data.Data d_aVr => c_aVp (t_aVq d_aVr))
     -> Data.Maybe.Maybe (c_aVp CompanyDatatypes.Company)
[GblId,
 Arity=2,
 Caf=NoCafRefs,
 Str=DmdType AA,
 Unf=Unf{Src=InlineStable, TopLvl=True, Arity=2, Value=True,
         ConLike=True, WorkFree=True, Expandable=True,
         Guidance=ALWAYS_IF(unsat_ok=True,boring_ok=True)
         Tmpl= \ (@ (c_a1rB :: * -> *)) (@ (t_a1rC :: * -> *)) _ _ ->
                 Data.Maybe.Nothing @ (c_a1rB CompanyDatatypes.Company)}]
CompanyDatatypes.$fDataCompany_$cdataCast1 =
  \ (@ (c_a1rB :: * -> *)) (@ (t_a1rC :: * -> *)) _ _ ->
    Data.Maybe.Nothing @ (c_a1rB CompanyDatatypes.Company)

CompanyDatatypes.$fDataCompany [InlPrag=[ALWAYS] CONLIKE]
  :: Data.Data.Data CompanyDatatypes.Company
[GblId[DFunId],
 Str=DmdType,
 Unf=DFun(arity=0) Data.Data.D:Data [{CompanyDatatypes.$fTypeableCompany},
                                     {CompanyDatatypes.$fDataCompany_$cgfoldl},
                                     {CompanyDatatypes.$fDataCompany_$cgunfold},
                                     {CompanyDatatypes.$fDataCompany_$ctoConstr},
                                     {CompanyDatatypes.$fDataCompany_$cdataTypeOf},
                                     {CompanyDatatypes.$fDataCompany_$cdataCast1},
                                     {CompanyDatatypes.$fDataCompany_$cdataCast2},
                                     {CompanyDatatypes.$fDataCompany_$cgmapT},
                                     {CompanyDatatypes.$fDataCompany_$cgmapQl},
                                     {CompanyDatatypes.$fDataCompany_$cgmapQr},
                                     {CompanyDatatypes.$fDataCompany_$cgmapQ},
                                     {CompanyDatatypes.$fDataCompany_$cgmapQi},
                                     {CompanyDatatypes.$fDataCompany_$cgmapM},
                                     {CompanyDatatypes.$fDataCompany_$cgmapMp},
                                     {CompanyDatatypes.$fDataCompany_$cgmapMo}]]
CompanyDatatypes.$fDataCompany =
  Data.Data.D:Data
    @ CompanyDatatypes.Company
    (CompanyDatatypes.$fTypeableCompany_$ctypeOf
     `cast` (Sym
               <(Data.Typeable.Internal.NTCo:Typeable <CompanyDatatypes.Company>)>
             :: (CompanyDatatypes.Company -> Data.Typeable.Internal.TypeRep)
                  ~#
                Data.Typeable.Internal.Typeable CompanyDatatypes.Company))
    CompanyDatatypes.$fDataCompany_$cgfoldl
    CompanyDatatypes.$fDataCompany_$cgunfold
    CompanyDatatypes.$fDataCompany_$ctoConstr
    CompanyDatatypes.$fDataCompany_$cdataTypeOf
    CompanyDatatypes.$fDataCompany_$cdataCast1
    CompanyDatatypes.$fDataCompany_$cdataCast2
    CompanyDatatypes.$fDataCompany_$cgmapT
    CompanyDatatypes.$fDataCompany_$cgmapQl
    CompanyDatatypes.$fDataCompany_$cgmapQr
    CompanyDatatypes.$fDataCompany_$cgmapQ
    CompanyDatatypes.$fDataCompany_$cgmapQi
    CompanyDatatypes.$fDataCompany_$cgmapM
    CompanyDatatypes.$fDataCompany_$cgmapMp
    CompanyDatatypes.$fDataCompany_$cgmapMo



